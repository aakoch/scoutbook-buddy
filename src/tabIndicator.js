// See https://developer.chrome.com/extensions/tabs#event-onActivated
chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.query({
        active: true
    }, function(tabs) {
        chrome.browserAction[tabs[0].url.toString().includes(".scoutbook.com/") ? "enable" : "disable"].call(tabs[0].id);
    });
});