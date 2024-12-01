// Load saved settings when the popup opens
document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.sync.get(["socialMediaSettings"], (data) => {
      const settings = data.socialMediaSettings || {};
      const form = document.getElementById("settingsForm");
  
      // Update the checkboxes based on saved settings
      Object.keys(settings).forEach((site) => {
        const checkbox = form.querySelector(`input[name="${site}"]`);
        if (checkbox) {
          checkbox.checked = settings[site];
        }
      });
    });
  
    // Save settings when "Save" is clicked
    document.getElementById("saveSettings").addEventListener("click", () => {
      const form = document.getElementById("settingsForm");
      const settings = {};
  
      // Collect checkbox values
      new FormData(form).forEach((value, key) => {
        settings[key] = value === "on";
      });
  
      // Save to Chrome storage
      chrome.storage.sync.set({ socialMediaSettings: settings }, () => {
        alert("Settings saved!");
      });
    });
  });
  