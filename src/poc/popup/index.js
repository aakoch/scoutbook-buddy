import browser from "../../utils/extension";
import "../../utils/i18n";
import './styles.scss'; // to get webpack to handle this
import logger from "../../utils/logger";

let activeTab;

(function () {
  browser.tabs.query({
    active: true,
    currentWindow: true,
    'url': '*://*.scoutbook.com/*'
  }, function (tabs) {
    activeTab = tabs[0];
    logger.debug('inside someFunction (): activeTab', activeTab);

    // if we're on the messages page the other script should take care of it?
    if (activeTab.url.includes('messages/default.asp')) {
      browser.tabs.sendMessage(activeTab.id, JSON.stringify({
        action: 'get-selected-count'
      }), renderSelectedCount);
    } else {
      renderPopup();
    }
  });
})();

let nothingHereTemplate = () => {
  logger.debug('inside nothingHereTemplate');
  return (`
  <div>
    <h2>Nothing's Here</h2>
    <p>Hey there! It looks like you're on a page where I don't have any functionality. Head on over to the Send Message page to see a demonstration.</p>
  </div>
  `);
}

let numberOfSelectedPeopleTemplate = (data) => {
  logger.debug('inside numberOfSelectedPeopleTemplate. data=', data);
  return (`
  <div>
    There are ${data.count} people selected.
  </div>
  `);
}

let renderMessage = (message) => {
  logger.debug('inside renderMessage. message=', message); // 2
  let messageElement = document.getElementById("message");
  messageElement.innerHTML = `<p class='message'>${message}</p>`;
}

let renderPopup = () => {
  if (browser.runtime.lastError) {
    // did the content script correctly set up a listener?
    logger.debug('Error: ', browser.runtime.lastError.message);

    if (activeTab.url.includes('messages/default.asp')) {
      renderMessage("Sorry, the messages plugin failed to load. Try <a id='reloadLink' href='#'>reloading</a> the page.");
    } else {
      renderMessage("Sorry, there was an error with Scoutbook Buddy. Try <a id='reloadLink' href='#'>reloading</a> the page.");
    }
    document.getElementById("reloadLink").addEventListener('click', function () {
      browser.tabs.reload(activeTab.id);
      window.close();
    });
  } else {
    let messageElement = document.getElementById("message");
    messageElement.innerHTML = nothingHereTemplate();
  }
}

let renderSelectedCount = (data) => {
  logger.debug('inside renderSelectedCount. data=', data);
  let messageElement = document.getElementById("message");
  if (data && typeof data != "string") {
    logger.debug('calling numberOfSelectedPeopleTemplate');
    let tmpl = numberOfSelectedPeopleTemplate(data);
    messageElement.innerHTML = tmpl;
  } else {
    renderPopup(data);
  }
}

document
  .getElementById("help-link")
  .addEventListener("click", function (e) {
    e.preventDefault();
    browser.tabs.create({
      'url': browser.extension.getURL('help.html')
    });
  });

document
  .getElementById("options-link")
  .addEventListener("click", function (e) {
    e.preventDefault();
    browser.tabs.create({
      'url': browser.extension.getURL('options.html')
    });
  });

document
  .getElementById("close-btn")
  .addEventListener("click", function (e) {
    e.preventDefault();
    window.close();
  });