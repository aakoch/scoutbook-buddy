// import browser from "./utils/extension";

// import Logger from './utils/logger';
// const logger = Logger.create('inject');

import window from 'window';
import document from 'document';

let timeouts = {
    pageshow: {},
    pagehide: {},
    pagebeforehide: {}
  },
  extensionId = document.getElementById('scoutbookbuddyextensionid').innerText,
  activePageId = window.$.mobile.activePage && window.$.mobile.activePage[0].id;

if (!document.buddywindow) {

  document.buddywindow = window;

  $(document)
    .on(['pageinit', 'pagebeforeshow.buddy'], function (event) {
      console.log(event.type, "triggered: namespace=", event.namespace, ", target.id=", event.target.id, ", activePageId=", activePageId);
    });

  for (let [key, value] of Object.entries(timeouts)) {
    $(document)
      .on(key + "." + activePageId, '#' + activePageId, function (event) {
        console.log(event.type, "triggered: key=", key, ", event.target.id=", event.target.id, ", activePageId=", activePageId);
        if (event.target.id == activePageId) {
          clearTimeout(value);
          value = setTimeout(() => {
            chrome.runtime.sendMessage(extensionId, JSON.stringify({
              event: key,
              activePageId: activePageId,
              eventType: event.type,
              eventTargetId: event.target.id
            }));
          }, 100);
        } else {
          if (key == 'pageremove') {
            setTimeout(() => {
              $(document).off("." + activePageId);
            }, 1);
          }
          console.log(key, ".", activePageId, "still has handler when target was", event.target.id);
        }
      });
  }

  $(document)
    .on('pageremove.' + activePageId, '#' + activePageId, function (event) {
      console.log('pageremove', "triggered: namespace=", event.namespace, " event.target.id=", event.target.id, ", activePageId=", activePageId);
      console.log('pageremove', "removing all events for page", activePageId);
      $(document).off("." + activePageId);

      $(document).on('pageinit.buddy', function (event) {
        console.log(event.type, "triggered: namespace=", event.namespace, ", target.id=", event.target.id, ", activePageId=", activePageId);
      });
    });

  setInterval(() => {
    chrome.runtime.sendMessage(extensionId, JSON.stringify({
      event: 'inject-heartbeat',
      activePageId: activePageId
    }));
  }, 500);

  // window.addEventListener('message', function (request, b) {
  //   console.log("inject.js window event: request=", request, ", b=", b);
  //   chrome.runtime.sendMessage(extensionId, JSON.stringify(request));
  // });

}