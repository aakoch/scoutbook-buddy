// import browser from "./utils/extension";
// import logger from "./utils/logger";
(function () {
  let getTime = () => {
    let date = new Date();
    return [date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds()].map((num) => {
      if (num < 10)
        return '0' + num;
      return num;
    }).join(':');
  }

  // TODO: move to logger file
  let logger = {
    debug: function (...args) {
      console.log(getTime(), ...args);
    }
  };

  let timeouts = {
      pageshow: {},
      pagehide: {},
      pagebeforehide: {}
    },
    extensionId = document.getElementById('scoutbookbuddyextensionid').innerText,
    activePageId = window.$.mobile.activePage[0].id;

  if (!document.buddywindow) {

    document.buddywindow = window;

    logger.debug("adding events for page", activePageId);

    $(document)
      .on(['pageinit', 'pagebeforeshow.buddy'], function (event) {
        logger.debug(event.type, "triggered: namespace=", event.namespace, ", target.id=", event.target.id, ", activePageId=", activePageId);
        // $(document).off(event.type + '.buddy');
      });

    for (let [key, value] of Object.entries(timeouts)) {
      $(document)
        .on(key + "." + activePageId, '#' + activePageId, function (event) {
          logger.debug(event.type, "triggered: key=", key, ", event.target.id=", event.target.id, ", activePageId=", activePageId);
          if (event.target.id == activePageId) {
            clearTimeout(value);
            value = setTimeout(() => {
              chrome.runtime.sendMessage(extensionId, {
                event: key,
                activePageId: activePageId,
                eventType: event.type,
                eventTargetId: event.target.id
              });
            }, 100);
          } else {
            if (key == 'pageremove') {
              setTimeout(() => {
                $(document).off("." + activePageId);
              }, 1);
            }
            logger.debug(key, ".", activePageId, "still has handler when target was", event.target.id);
          }
        });
    }

    $(document)
      .on('pageremove.' + activePageId, '#' + activePageId, function (event) {
        logger.debug('pageremove', "triggered: namespace=", event.namespace, " event.target.id=", event.target.id, ", activePageId=", activePageId);
        logger.debug('pageremove', "removing all events for page", activePageId);
        $(document).off("." + activePageId);

        $(document).on('pageinit.buddy', function (event) {
          logger.debug(event.type, "triggered: namespace=", event.namespace, ", target.id=", event.target.id, ", activePageId=", activePageId);
        });
      });

    setInterval(() => {
      chrome.runtime.sendMessage(extensionId, {
        event: 'inject-heartbeat',
        activePageId: activePageId
      });
    }, 500);

    window.addEventListener('message', handleMessage);

  }

  function handleMessage(request) {
    logger.debug("inject.js handleMessage(): request=", request);
    chrome.runtime.sendMessage(extensionId, request);
  }


})();