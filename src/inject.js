import browser from "./utils/extension";
import logger from "./utils/logger";

logger.debug("entering inject.js");

function setupListener() {
  window.addEventListener('message', handleMessage);

  logger.debug('listener set up on page');
}

function handleMessage(request) {
  logger.debug("inject.js handleMessage(): request=", request);
  // if (request.action == 'get-jquery') {
  //   var _$ = window.jQuery;
  //   logger.debug("returning requested jQuery=", _$);
  //   return _$;
  // } else {
    browser.runtime.sendMessage(browser.runtime.id, request, function (sendResponse) {
      logger.debug('done passing message from window to background');
    });
  // }
}

// if (!document.getElementById('scoutbookBuddy')) {

var script = document.createElement('script');
script.type = 'text/javascript';
script.id = 'scoutbookBuddy';

// I need access to $ from the page and this is how I can
script.textContent = [setupListener, handleMessage, "setupListener()"].join('\n');
document.body.appendChild(script);

//   // function loadScript(url) {
//   //   var xhr = new XMLHttpRequest();
//   //   xhr.onreadystatechange = function () {
//   //     if (this.readyState == 4) {
//   //       if (this.status == 200) {
//   //         logger.debug(this.response);
//   //       }
//   //       else {
//   //         logger.debug('error');
//   //       }
//   //     }
//   //   };

//   //   xhr.open("GET", url, true);
//   //   xhr.send();
//   //   xhr.onerror = function () {
//   //     logger.debug('error');
//   //   };
//   // }
// }
// else {
//   logger.debug('not injecting');
//   setupListener();
// }

// browser.runtime.sendMessage(browser.runtime.id, 'inject.js was injected',
//   function (sendResponse) {
//     logger.debug('inject.js done');
//   });

$("#scoutbookbuddyindicator", document).length && (function () {
  // let extensionId = document.getElementById('scoutbookbuddyextensionid').innerText;
  // browser.runtime.sendMessage(extensionId, {event: 'pageshow'});
})();


logger.debug('inject.js loaded');