import "../utils/i18n";
import './styles.scss'; // to get webpack to handle this

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