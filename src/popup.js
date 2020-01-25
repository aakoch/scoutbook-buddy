import './popup.scss'; // to get webpack to handle this

document.getElementById("go-to-options").onclick = function () {

  // console.log('clicked');
  //chrome.tabs.create({ url: "options.html" });
  chrome.runtime.openOptionsPage();

  /*
  if (chrome.runtime.openOptionsPage) {
    // New way to open options pages, if supported (Chrome 42+).
    chrome.runtime.openOptionsPage();
  } else {
    // Reasonable fallback.
    window.open(chrome.runtime.getURL('options.html'));
  }
  */
};