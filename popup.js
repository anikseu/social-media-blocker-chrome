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
        showCustomAlert("Settings saved!");
      });
    });
  });
  

  // Function to show a custom alert
function showCustomAlert(message) {
  // Create alert container
  const alertDiv = document.createElement("div");
  alertDiv.textContent = message;
  alertDiv.style.position = "fixed";
  alertDiv.style.top = "10px";
  alertDiv.style.left = "50%";
  alertDiv.style.width = "200px";
  alertDiv.style.transform = "translateX(-50%)";
  alertDiv.style.backgroundColor = "#36373B";
  alertDiv.style.color = "white";
  alertDiv.style.padding = "10px 20px";
  alertDiv.style.borderRadius = "5px";
  alertDiv.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.3)";
  alertDiv.style.zIndex = "1000";
  alertDiv.style.fontSize = "16px";
  alertDiv.style.textAlign = "center";

  // Append alert to the document
  document.body.appendChild(alertDiv);

  // Remove alert after 3 seconds
  setTimeout(() => {
    alertDiv.remove();
  }, 2000);
}