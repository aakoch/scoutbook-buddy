import "../utils/i18n";
import ext from '../utils/extension';
import './styles.scss'; // to get webpack to handle this

function renderSelectedCount(count) {
  document.getElementById('buddy-count').innerText = 'There ' + (count.count == 1 ?
      'is 1 feature' : 'are ' + count.count + ' features') +
    ' on the page.';
}

ext.tabs.query({
  active: true,
  url: '*://*.scoutbook.com/*'
}, function (tabs) {
  if (tabs.length) {
    debugger;
    ext.tabs.sendMessage(tabs[0].id, JSON.stringify({
      action: 'get-selected-count'
    }), renderSelectedCount);
  }
});

document
  .getElementById('viewOptions')
  .addEventListener('click', function () {
    window.close();
    chrome.runtime.openOptionsPage();
  })

document
  .getElementById("close-btn")
  .addEventListener("click", function (e) {
    window.close();
    return false;
  });

document
  .getElementById("help-link")
  .addEventListener("click", function (e) {
    chrome.tabs.create({
      'url': chrome.extension.getURL('help.html')
    });
    return false;
  });

document
  .getElementById("options-link")
  .addEventListener("click", function (e) {
    chrome.runtime.openOptionsPage();
    return false;
  });