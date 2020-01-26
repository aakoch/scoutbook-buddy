import browser from "./utils/extension";
import logger from './utils/logger';

let pageShowHandlers = [];

function handleMessage(request, sender, sendResponse) {
  logger.info("background.js mesage received. request=", request, ", sender=", sender);
  if (request.event == 'pageshow') {
    sendAction('add-footer-indicator');

    if (sender.url.includes('messages/default.asp')) {
      injectPreviewButton();
    }

    runPageShowHandlers();
  }
  else if (request.action == 'save-message') {
    let message = {
      'action': 'restore-message',
      'subject': request.subject,
      'body': request.body
    };
    pageShowHandlers.push(function () { sendMessage(message) });
  }
}

function injectPreviewButton() {
  logger.info("entering injectPreviewButton");
  browser.tabs.query({
    active: true,
    url: '*://*.scoutbook.com/*'
  }, function (tabs) {
    if (tabs.length) {
      var resourceUrl = browser.extension.getURL('scripts/preview.js');

      const actualCode = `
        var s = document.createElement('span');
        s.id = 'scoutbookbuddyextensionid';
        s.style = 'display:none';
        s.innerText = '${chrome.runtime.id}';
        (document.head || document.documentElement).appendChild(s);

        var s = document.createElement('script');
        s.src = '${resourceUrl}';
        (document.head || document.documentElement).appendChild(s);
      `;

      browser.tabs.executeScript(tabs[0].id, {
        code: actualCode,
        runAt: 'document_idle'
      });
    }
  });
}

function runPageShowHandlers() {
  pageShowHandlers.forEach(fn => {
    fn.apply();
  });
  pageShowHandlers = [];
}

// how to inject script from background script
function inject() {
  logger.info("entering background inject method");
  browser.tabs.query({
    active: true,
    url: '*://*.scoutbook.com/*'
  }, function (tabs) {
    if (tabs.length) {
      var resourceUrl = browser.extension.getURL('scripts/inject.js');

      const actualCode = `
        var s = document.createElement('span');
        s.id = 'scoutbookbuddyextensionid';
        s.style = 'display:none';
        s.innerText = '${chrome.runtime.id}';
        (document.head || document.documentElement).appendChild(s);

        var s = document.createElement('script');
        s.src = '${resourceUrl}';
        s.onload = function() {
          this.remove();
        };
        (document.head || document.documentElement).appendChild(s);
      `;

      browser.tabs.executeScript(tabs[0].id, {
        code: actualCode,
        runAt: 'document_idle'
      });
    }
  });
}

function sendAction(action) {
  browser.tabs.query({
    active: true,
    url: '*://*.scoutbook.com/*'
  }, function (tabs) {
    if (tabs.length > 0) {
      browser.tabs.sendMessage(tabs[0].id, {
        action: action
      }, function (sendResponse) {
        if (browser.runtime.lastError) {
          logger.info('Error: ', browser.runtime.lastError.message);
        } else {
          logger.info('done making call in background', r);
        }
      });
    }
  });
}

function sendMessage(message) {
  browser.tabs.query({
    active: true,
    url: '*://*.scoutbook.com/*'
  }, function (tabs) {
    if (tabs.length > 0) {
      browser.tabs.sendMessage(tabs[0].id, message, function (sendResponse) {
        if (browser.runtime.lastError) {
          logger.info('Error: ', browser.runtime.lastError.message);
        } else {
          logger.info('done making call in background', r);
        }
      });
    }
  });
}

var updateListener = (tabId, changeInfo, tab) => {
  logger.info("tab was updated. id=", tabId, ", changeInfo=", changeInfo, ", tab=", tab);
  if (changeInfo.status == 'complete' && tab.url.includes('scoutbook.com')) {
    inject();
    // doesn't work to add footer here since the page is not yet rendered
    sendAction('add-footer-indicator');
  }
}

// See https://developer.chrome.com/extensions/tabs#event-onUpdated
browser.tabs.onUpdated.addListener(updateListener);

browser.runtime.onMessage.addListener(handleMessage);

browser.runtime.onMessageExternal.addListener(handleMessage);

var tenSecondInterval;

function startIntervalMessages() {
  tenSecondInterval = setInterval(function () {
    browser.tabs.query({
      active: true,
      url: '*://*.scoutbook.com/*'
    }, function (tabs) {
      if (tabs.length > 0) {
        browser.tabs.sendMessage(tabs[0].id, {
          action: 'heartbeat'
        }, function (response) {
          if (browser.runtime.lastError) {
            logger.info('Error: ', browser.runtime.lastError.message);
            // undecided if I should clear the interval on an error
            //clearInterval(tenSecondInterval);
          } else {
            logger.info('heartbeat returned');
          }
        });
      }
    })
  }, 10000);
}

//startIntervalMessages();