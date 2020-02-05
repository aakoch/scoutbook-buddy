
// See https://developer.chrome.com/extensions/tabs#event-onActivated
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.query({
    active: true
  }, function (tabs) {
    let enableIcon = tabs[0].url.toString().includes(".scoutbook.com/") || (tabs[0].url || tabs[0].pendingUrl).toString().includes("chrome-extension://" + chrome.runtime.id);
    chrome.browserAction[enableIcon ? "enable" : "disable"].call(tabs[0].id);
  });
});