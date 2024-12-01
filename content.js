const negativeSocialMediaQuotes = [
    "Social media is the ultimate tool for comparison, robbing us of contentment and joy.",
    "Behind the glamorous posts, social media fosters insecurity and loneliness.",
    "A platform designed to connect us often leaves us feeling more isolated than ever.",
    "Social media profits from your addiction to scrolling and superficial interactions.",
    "The constant need for likes and validation erodes genuine self-worth.",
    "Social media amplifies misinformation faster than it spreads the truth.",
    "Privacy is a myth in a world where social media sells your data.",
    "The curated lives on social media are carefully crafted illusions of perfection.",
    "Social media transforms meaningful conversations into fleeting exchanges of emojis.",
    "Our attention span and focus are the hidden casualties of endless scrolling."
];
  

chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "showReminder") {
      const site = message.site;
      // pick a random quote from the array
      const quote = negativeSocialMediaQuotes[Math.floor(Math.random() * negativeSocialMediaQuotes.length)];
      showPopup(`Reminder: Limit your time on ${site}. \n \n  "${quote}"`);
    }
  });
  
  function showPopup(message) {
    const popup = document.createElement("div");
    
    // make a large popup and blur the content below it 
    popup.style.position = "fixed";
    popup.style.top = "0";
    popup.style.left = "0";
    popup.style.width = "100%";
    popup.style.height = "100%";
    popup.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    popup.style.color = "white";
    popup.style.display = "flex";
    popup.style.justifyContent = "center";
    popup.style.alignItems = "center";
    popup.style.zIndex = "9999";
    popup.innerText = message;

    // font size
    popup.style.fontSize = "2em";

    // make the popup darker slowly and should stop at 0.1
    let opacity = 0;
    const interval = setInterval(() => {
      opacity += 0.05;
      popup.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
      if (opacity >= 1.0) {
        clearInterval(interval);
      }
    }, 100);

    // add popup to the body
    document.body.appendChild(popup);

  }
  