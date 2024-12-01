let firedTabs = {}; // To track fired reminders for each tab ID

// On installation or extension update
chrome.runtime.onInstalled.addListener(() => {
  // Periodic reminders
  chrome.alarms.create("periodicReminder", { periodInMinutes: 0.1 });
});

// Detect tab activation
chrome.tabs.onActivated.addListener((activeInfo) => {
  checkAndFireTabAlarm(activeInfo.tabId);
});

// Detect tab URL changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    // Reset fired status on URL change
    delete firedTabs[tabId];
  }
  // reset fired status on page reload 
  if(changeInfo.status === "loading") {
    delete firedTabs[tabId];
  }
  
  if (changeInfo.status === "complete") {
    checkAndFireTabAlarm(tabId);
  }
});

// Handle periodic alarms
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "periodicReminder") {
    handlePeriodicReminders();
  }
});

// Check and fire one-time alarm for a tab
function checkAndFireTabAlarm(tabId) {
  chrome.tabs.get(tabId, (tab) => {
    if (tab && tab.url) {
      const url = new URL(tab.url);
      const domain = url.hostname;

      chrome.storage.sync.get(["socialMediaSettings"], (data) => {
        const settings = data.socialMediaSettings || {};

        // Fire a reminder only if it hasn't already been fired for this tab
        if (!firedTabs[tabId]) {
          if (
            (settings.facebook && domain.includes("facebook.com")) ||
            (settings.instagram && domain.includes("instagram.com")) ||
            (settings.twitter && domain.includes("twitter.com")) ||
            (settings.youtube && domain.includes("youtube.com"))
          ) {
            // Mark this tab as "reminder fired"
            firedTabs[tabId] = true;

            // Send the message to content script
            chrome.tabs.sendMessage(tabId, {
              type: "showReminder",
              site: getSiteName(domain, settings),
            });
          }
        }
      });
    }
  });
}

// Handle periodic reminders for the active tab
function handlePeriodicReminders() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      const tabId = tabs[0].id;
      const url = new URL(tabs[0].url);
      const domain = url.hostname;

      chrome.storage.sync.get(["socialMediaSettings"], (data) => {
        const settings = data.socialMediaSettings || {};

        if (
          (settings.facebook && domain.includes("facebook.com")) ||
          (settings.instagram && domain.includes("instagram.com")) ||
          (settings.twitter && domain.includes("twitter.com")) ||
          (settings.youtube && domain.includes("youtube.com"))
        ) {
          // Send a reminder only if not already fired for this tab
          if (!firedTabs[tabId]) {
            firedTabs[tabId] = true;

            chrome.tabs.sendMessage(tabId, {
              type: "showReminder",
              site: getSiteName(domain, settings),
            });
          }
        }
      });
    }
  });
}

// Get a friendly site name for the reminder
function getSiteName(domain, settings) {
  if (settings.facebook && domain.includes("facebook.com")) return "Facebook";
  if (settings.instagram && domain.includes("instagram.com")) return "Instagram";
  if (settings.twitter && domain.includes("twitter.com")) return "Twitter";
  if (settings.youtube && domain.includes("youtube.com")) return "YouTube";
  return "this site";
}

// Cleanup when tabs are closed
chrome.tabs.onRemoved.addListener((tabId) => {
  delete firedTabs[tabId];
});


