import browser from "./utils/extension";

// import Logger from './utils/logger';
// Logger.setLogLevel(Logger.LogLevels.DEBUG)
// const logger = Logger.create('background');


let pageShowHandlers = [];
let pageshowTimeout;

let injected = false;
let injectedHeartbeatTimeout;
let injectedCounter = 0;
let injectedTimeout;

function sendHeartbeats(port) {
  port.postMessage(JSON.stringify({
    action: 'heartbeat'
  }), function (response) {
    if (browser.runtime.lastError) {
      console.log('Error: ', browser.runtime.lastError.message);
      // undecided if I should clear the interval on an error
      //clearInterval(tenSecondInterval);
    } else {
      console.log('heartbeat returned');
    }
  });
}


chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === 'contentscript') {
    port.onMessage.addListener(portHandler);

    port.onDisconnect.addListener(function (msg) {
      console.log('Port closed');
    });

    var tenSecondInterval;

    function startIntervalMessages() {
      tenSecondInterval = setInterval(function () {
        sendHeartbeats(port);
      }, 10000);
    }
    startIntervalMessages();
  } else if (port.name === 'inject') {
    port.onMessage.addListener(portHandler);

    port.onDisconnect.addListener(function (msg) {
      console.log('Port closed');
    });
  }
});

function portHandler(request, sender, sendResponse) {
  if (typeof request === 'object')
    return true;

  try {
    request = JSON.parse(request);
  } catch (e) {
    if (request.msg) { // && request.msg.startsWith('{"hostx":"www.","text":"RestartSession","sensitive":"yes","url":"https://www.scoutbook.com/mobile/dashboard/messages/default.asp?UnitID')) {
      // for messages from scoutbook site
      portHandler(request.msg, sender, sendResponse);
    } else {
      console.log("parse error", e, request);
    }
    return true;
  }

  console.log("portHandler", request);
}

function handleMessage(request, sender, sendResponse) {
  if (typeof request === 'object')
    return true;

  try {
    request = JSON.parse(request);
  } catch (e) {
    if (request.msg) { // && request.msg.startsWith('{"hostx":"www.","text":"RestartSession","sensitive":"yes","url":"https://www.scoutbook.com/mobile/dashboard/messages/default.asp?UnitID')) {
      // for messages from scoutbook site
      handleMessage(request.msg, sender, sendResponse);
    } else {
      console.log("parse error", e, request);
    }
    return true;
  }
  if (request.event === 'pageshow') {
    // console.count('pageshow event received');
    if (request.source === 'mutationObserver') {
      // console.log('ignoring pageshow event from ' + request.source);
    } else if (!!request.pageId) {
      oncePerPage(request, () => {
        // console.count('inside once per page');
        // console.log(new Date().toISOString() + ": background.js pageshow mesage from mutationObserver. request=", request, ", sender=", sender);
        sendAction('add-footer-indicator');

        if (sender.url.includes('messages/default.asp') || request.url.includes('messages/default.asp')) {
          injectPreviewButton();
        }

        runPageShowHandlers();
      });
    } else {
      console.log('pageshow event from ' + request.sender);
    }
  } else if (request.action == 'save-message') {
    console.log(": background.js save-message mesage received. request=", request, ", sender=", sender);
    let message = {
      'action': 'restore-message',
      'subject': request.subject,
      'body': request.body
    };
    pageShowHandlers.push(function () {
      sendMessage(message)
    });
  } else if (request.event == 'inject-page-listeners') {
    console.log(": background.js inject-page-listeners mesage received. request=", request, ", sender=", sender);
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
    // console.log("background.js unknown mesage received. request=", request, ", sender=", sender);
    return true;
  }
}

// to inject on the page itself, hence giving access to window and the page's jQuery (actually it's $) 
// you have to do it this way. Otherwise it is injected to the content script
function injectToPage(filename) {
  console.count('injectToPage called with ' + filename);
  browser.tabs.query({
    active: true,
    url: '*://*.scoutbook.com/*'
  }, function (tabs) {
    if (tabs.length) {
      var injectUrl = browser.extension.getURL(filename);

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

      browser.tabs.executeScript(tabs[0].id, {
        code: actualCode,
        runAt: 'document_end'
      });
    } else {
      console.warn('could not inject "' + filename + '" on page');
    }
  });

}


var latchMap = new Map();

function latch(func, timeMs) {
  // if function has ran in the last timeMs milliseconds, don't run it again
  let funcHash = func.toString();
  if (!latchMap.has(funcHash) || (latchMap.has(funcHash) && Date.now() > latchMap.get(funcHash) + timeMs)) {
    latchMap.set(funcHash, Date.now());
    func();
  }
}

function digestMessage(message) {
  const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
  return crypto.subtle.digest('SHA-1', msgUint8); // hash the message
}

var oncePerPageMap = new Map();
const tenSecondsAsMillis = 1000 * 60 * 10;

function oncePerPage(slimmedEvent, func) {
  var page = slimmedEvent.pageId;
  digestMessage(page.toString() + func.toString())
    .then(hashBuffer => {
      const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
      const funcHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
      console.group('opp');
      console.log(page.toString() + ' - ' + slimmedEvent.url);
      //console.log('func', func.toString());
      //console.log('funcHash', funcHash.toString());

      if (!oncePerPageMap.has(funcHash) || (oncePerPageMap.has(funcHash) && Date.now() > oncePerPageMap.get(funcHash) + tenSecondsAsMillis)) {
        console.count('running - ' + funcHash);
        oncePerPageMap.set(funcHash, Date.now());
        func();
      }
      else {
        console.count('blocking - ' + funcHash);
      }
      console.groupEnd('opp');
    })
}

function injectPreviewButton() {
    console.count('injectPreviewButton called');
    injectToPage('scripts/preview.js');
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
    console.log("entering background inject method with forced injection even though injected =", injected);
  } else {
    console.log("entering background inject method with injected =", injected);
  }
  if (forceInjection || !injected) {
    clearTimeout(injectedTimeout);
    injectedTimeout = setTimeout(() => {
      console.log("timeout reached");
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

          console.log("executing script in tab");
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
      console.log("sending action=" + action);
      browser.tabs.sendMessage(tabs[0].id, JSON.stringify({
        action: action
      }));
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
          console.log('Error: ', browser.runtime.lastError.message);
        } else {
          console.log('done making call in background', r);
        }
      });
    }
  });
}

var updateListener = (tabId, changeInfo, tab) => {
  console.log("tab was updated. id=", tabId, ", changeInfo=", changeInfo, ", tab=", tab);
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


// chrome.runtime.onStartup.addListener((event) => {
//   console.log("event: onStartup", event);
// });

chrome.runtime.onInstalled.addListener(() => {
  // console.log("event: onInstalled", event);

  chrome.tabs.query({
    url: '*://*.scoutbook.com/*'
  }, function (tabs) {
    if (tabs.length) {
      tabs.forEach(tab => chrome.tabs.reload(tab.id));
    }
  })
});

// chrome.runtime.onSuspend.addListener(() => {
//   console.log("event: onSuspend", event);
// });

// chrome.runtime.onRestartRequired.addListener(() => {
//   console.log("event: onRestartRequired", event);
// });

// chrome.runtime.reload()


// // var callback = function(details) {...};
// var filter = {
//   urls: ['*://*.scoutbook.com/*']
// };
// // var opt_extraInfoSpec = [...];


// chrome.webRequest.onBeforeRequest.addListener(function (details) {
//   console.log("webRequest: onBeforeRequest", details);
//   if (!!details.requestBody) {
//     console.log("webRequest: onBeforeRequest - requestBody", details.requestBody);
//   }
// }, filter, ["blocking", "requestBody"]);

// chrome.webRequest.onBeforeSendHeaders.addListener(function (details) {
//   console.log("webRequest: onBeforeSendHeaders", details);

//   for (var i = 0; i < details.requestHeaders.length; ++i) {
//     if (details.requestHeaders[i].name === 'User-Agent') {
//       details.requestHeaders.splice(i, 1);
//       break;
//     }
//   }
//   return {
//     requestHeaders: details.requestHeaders
//   };

// }, filter, ["blocking", "requestHeaders"]);


// chrome.webRequest.onResponseStarted.addListener(function (details) {
//   console.log("webRequest: onResponseStarted", details);
// }, filter);

// chrome.webRequest.onCompleted.addListener(function (details) {
//   console.log("webRequest: onCompleted", details);
// }, filter);

inject(true);
//startIntervalMessages();


// var msgs = ['　　　1', '　　10 ', '　10　', '10　　', '0　　　', '　　　'];
// var msgs = ['⑁⑂⑃⑀', '⑂⑃⑀⑁', '⑃⑀⑁⑂', '⑀⑁⑂⑃']
// chrome.browserAction.setBadgeBackgroundColor({color: [0, 0, 0, 255]});
// var msgs = ['　　　☼', '　　☼　', '　☼　　', '☼　　　', '　　　　'];
// var msgCounter = -1;
// setInterval(function () {
//   msgCounter += (1 + msgs.length);
//   chrome.browserAction.setBadgeText({text: msgs[msgCounter % msgs.length]});
//   let r = Math.round(Math.random() * 255), 
//       g = Math.round(Math.random() * 255), 
//       b = Math.round(Math.random() * 255);
//   console.log(r, g, b);
//   chrome.browserAction.setBadgeBackgroundColor({color: [r, g, b, 255]});
// }, 150);
