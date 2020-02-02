import document from 'document';
import browser from './utils/extension';

import Logger from './utils/logger';
const logger = Logger.create('eventlisteners');

!window.scoutbookbuddyinitialized && (function (window) {

  var $ = window.$ || window.jQuery;

  // Logger.createDefaultHandler({
  //   formatter: function(messages, context) {
  //     // prefix each log message with a timestamp.
  //     messages.unshift(new Date().toUTCString())
  //   }
  // });


  function passEventOn(event) {
    if (!!extensionId) {
      let slimmedEvent = {
        'target': {
          'innerText': event.target.innerText,
          'innerHTML': event.target.innerHTML,
          'id': event.target.id,
          'classList': event.target.classList
        },
        'event': event.type
      };
      browser.runtime.sendMessage(extensionId, JSON.stringify(slimmedEvent));
    }
    else {
      logger.info('dropping event', event.type);
    }
  }

  let events = [];
  let skipEvents = [
    'mouseout', 'mousemove', 'mouseover', 'mousewheel', 'mousedown', 'mouseup', 'mouseenter', 'mouseleave',
    'vmouseout', 'vmousemove', 'vmouseover',
    'pointerover', 'pointermove', 'pointerout', 'pointerrawupdate', 'pointerdown', 'pointerenter', 'pointerleave',
    'deviceorientationabsolute', 'scroll', 'wheel',
    'focus', 'blur',
    'keyup', 'keydown', 'keypress', 'input',
    'scrollstart', 'scrollstop',
    'message',
    // less common:
    'vmousedown', 'focusin', 'selectstart', 'selectionchange', 'pointerup', 'vclick',
    // some more jQuery we aren't interested in
    'listviewcreate', 'selectmenubeforecreate', 'updatelayout', 'focusout', 'vmousecancel', 'vmouseup', 'vmousedown'
  ];

  var extensionId = document.getElementById('scoutbookbuddyextensionid').innerText;
  var attr;

  if (!extensionId) {
    let retry = () => {
      extensionId = document.getElementById('scoutbookbuddyextensionid').innerText;
      if (!extensionId) {
        setTimeout(retry, 10);
      }
    }
  }

  let windowSkipEvents = skipEvents.concat(['click', 'dblclick']); // click event should be caught before it reaches the window
  for (attr in window) {
    if (attr.indexOf('on') == 0) {
      if (!windowSkipEvents.includes(attr.substring(2))) {
        events.push(attr);
        window.addEventListener(attr.substring(2), function (event) {
          logger.debug("window event", event.type);
          passEventOn(event);
        });
      }
    }
  }

  for (attr in document) {
    if (attr.indexOf('on') == 0) {
      if (!skipEvents.includes(attr.substring(2))) {
        events.push(attr);
        document.addEventListener(attr.substring(2), function (event) {
          logger.debug("document event", event.type);
          passEventOn(event);
        });
      }
    }
  }

  function readystateHandler() {
    if (!!$) {
      $(function ($) {
        for (attr in $.event.global) {
          if (!skipEvents.includes(attr)) {
            events.push(attr);
            $(document).on(attr, function (event) {
              logger.info("jquery event", event.type);
              passEventOn(event);
            });
          }
        }
        console.log('events registered:', events.join(', '));
      });
      document.removeEventListener('readystatechange', readystateHandler);
    }
    else {
      setTimeout(readystateHandler, 100);
    }
  }

  document.addEventListener('readystatechange', readystateHandler);
  
  window.scoutbookbuddyinitialized = true;

})(window);