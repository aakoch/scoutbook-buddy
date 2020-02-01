import browser from "./utils/extension";
import logger from './utils/logger';

let pageShowHandlers = [];
let pageshowTimeout;

let injected = false;
let injectedHeartbeatTimeout;
let injectedCounter = 0;
let injectedTimeout;

function handleMessage(request, sender, sendResponse) {
  try {
  request =  JSON.parse(request);
  } catch (e) {
    console.error('Error:', e, request);
    return;
  }
  if (request.event == 'pageshow') {
    // if (request.source !== 'mutationObserver') {
    clearTimeout(pageshowTimeout);
    pageshowTimeout = setTimeout(() => {
      logger.info(new Date().toISOString() + ": background.js mesage received. request=", request, ", sender=", sender);
      sendAction('add-footer-indicator');

      if (sender.url.includes('messages/default.asp')) {
        injectPreviewButton();
      }

      runPageShowHandlers();
    }, 10);
  } else if (request.action == 'save-message') {
    logger.info(new Date().toISOString(), ": background.js save-message mesage received. request=", request, ", sender=", sender);
    let message = {
      'action': 'restore-message',
      'subject': request.subject,
      'body': request.body
    };
    pageShowHandlers.push(function () {
      sendMessage(message)
    });
  } else if (request.event == 'inject-page-listeners') {
    logger.info(new Date().toISOString(), ": background.js inject-page-listeners mesage received. request=", request, ", sender=", sender);
    // inject(true);
  } else if (request.event == 'inject-heartbeat') {
    // if (injectedCounter++ % 10 == 0) {
    //   console.log("injected set to true x10 at ", new Date());
    // }
    injected = true;
    clearTimeout(injectedHeartbeatTimeout);
    injectedHeartbeatTimeout = setTimeout(() => {
      console.log("injected set to false at ", new Date());
      inject(true);
    }, 2000);
  } else {
    logger.info(new Date(), ": background.js mesage received. request=", request, ", sender=", sender);
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
function inject(forceInjection) {
  if (forceInjection) {
    logger.info(new Date().toISOString(), "entering background inject method with forced injection even though injected =", injected);
  } else {
    logger.info(new Date().toISOString(), "entering background inject method with injected =", injected);
  }
  if (forceInjection || !injected) {
    clearTimeout(injectedTimeout);
    injectedTimeout = setTimeout(() => {
      logger.info(new Date().toISOString(), "timeout reached");
      browser.tabs.query({
        active: true,
        url: '*://*.scoutbook.com/*'
      }, function (tabs) {
        if (tabs.length) {
          var injectUrl = browser.extension.getURL('scripts/inject.js');

          const actualCode = `
            var s = document.createElement('span');
            s.id = 'scoutbookbuddyextensionid';
            s.style = 'display:none';
            s.innerText = '${chrome.runtime.id}';
            (document.head || document.documentElement).appendChild(s);

            var s = document.createElement('script');
            s.src = '${injectUrl}';
            s.onload = function() {
              // this.remove();
            };
            (document.head || document.documentElement).appendChild(s);
          `;

          logger.debug("executing script in tab");
          browser.tabs.executeScript(tabs[0].id, {
            code: actualCode,
            runAt: 'document_start'
          });
        }
      });
    }, 6);
  }
}

function sendAction(action) {
  browser.tabs.query({
    active: true,
    url: '*://*.scoutbook.com/*'
  }, function (tabs) {
    if (tabs.length > 0) {
      logger.debug("sending action=" + action);
      browser.tabs.sendMessage(tabs[0].id, JSON.stringify({
        action: action
      }), function (sendResponse) {
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
      browser.tabs.sendMessage(tabs[0].id, JSON.stringify(message), function (sendResponse) {
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
    inject(true);
    // doesn't work to add footer here since the page is not yet rendered
    //sendAction('add-footer-indicator');
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
        browser.tabs.sendMessage(tabs[0].id, JSON.stringify({
          action: 'heartbeat'
        }), function (response) {
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

chrome.runtime.onStartup.addListener((event) => {
  logger.info("event: onStartup", event);
});

chrome.runtime.onInstalled.addListener(() => {
  logger.info("event: onInstalled", event);

  chrome.tabs.query({
    url: '*://*.scoutbook.com/*'
  }, function (tabs) {
    if (tabs.length) {
      tabs.forEach(tab => chrome.tabs.reload(tab.id));
    }
  })
});

chrome.runtime.onSuspend.addListener(() => {
  logger.info("event: onSuspend", event);
});

chrome.runtime.onRestartRequired.addListener(() => {
  logger.info("event: onRestartRequired", event);
});

// chrome.runtime.reload()

chrome.runtime.onConnect.addListener(function (port) {
  console.assert(port.name == "knockknock");
  port.onMessage.addListener(function (msg) {
    if (msg.joke == "Knock knock")
      port.postMessage({
        question: "Who's there?"
      });
    else if (msg.answer == "Madame")
      port.postMessage({
        question: "Madame who?"
      });
    else if (msg.answer == "Madame... Bovary")
      port.postMessage({
        question: "I don't get it."
      });
  });
});

// var callback = function(details) {...};
var filter = {
  urls: ['*://*.scoutbook.com/*']
};
// var opt_extraInfoSpec = [...];


chrome.webRequest.onBeforeRequest.addListener(function (details) {
  logger.info("webRequest: onBeforeRequest", details);
  if (!!details.requestBody) {
    logger.info("webRequest: onBeforeRequest - requestBody", details.requestBody);
  }
}, filter, ["blocking", "requestBody"]);

chrome.webRequest.onBeforeSendHeaders.addListener(function (details) {
  logger.info("webRequest: onBeforeSendHeaders", details);

  for (var i = 0; i < details.requestHeaders.length; ++i) {
    if (details.requestHeaders[i].name === 'User-Agent') {
      details.requestHeaders.splice(i, 1);
      break;
    }
  }
  return {
    requestHeaders: details.requestHeaders
  };

}, filter, ["blocking", "requestHeaders"]);


chrome.webRequest.onResponseStarted.addListener(function (details) {
  logger.info("webRequest: onResponseStarted", details);
}, filter);

chrome.webRequest.onCompleted.addListener(function (details) {
  logger.info("webRequest: onCompleted", details);
}, filter);

inject(true);
//startIntervalMessages();