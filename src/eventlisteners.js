!window.scoutbookbuddyinitialized && (function (window) {

  console.clear();

  function passEventOn(event) {
    if (!!extensionId) {
      let slimmedEvent = {
        'target': {
          'innerText': event.target.innerText,
          'innerHTML': event.target.innerHTML,
          'id': event.target.id,
          'classList': event.target.classList
        },
        'type': event.type
      };
      chrome.runtime.sendMessage(extensionId, JSON.stringify(slimmedEvent));
    }
    else {
      console.log('dropping event', event.type);
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
    // less common:
    'vmousedown', 'focusin', 'selectstart', 'selectionchange', 'pointerup', 
    // some more jQuery we aren't interested in
    'listviewcreate', 'selectmenubeforecreate', 'updatelayout', 'focusout', 'vmousecancel', 'vmouseup', 'vmousedown'
  ];

  var extensionId = document.getElementById('scoutbookbuddyextensionid').innerText;

  if (!extensionId) {
    let retry = () => {
      extensionId = document.getElementById('scoutbookbuddyextensionid').innerText;
      if (!extensionId) {
        setTimeout(retry, 10);
      }
    }
  }

  for (attr in window) {
    if (attr.indexOf('on') == 0) {
      if (!skipEvents.includes(attr.substring(2))) {
        events.push(attr);
        window.addEventListener(attr.substring(2), function (event) {
          console.log("window event", event.type);
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
          console.log("document event", event.type);
          passEventOn(event);
        });
      }
    }
  }

  // if ((window | self).jQuery !== 'undefined') {
  //   (window | self).jQuery.holdReady(true);

  function readystateHandler() {
      $(function ($) {
        for (attr in $.event.global) {
          if (attr) {
            if (!skipEvents.includes(attr)) {
              events.push(attr);
              $(document).on(attr, function (event) {
                console.log("jquery event", event.type);
                passEventOn(event);
              });
            }
          }
        }
        console.log('events registered:', events.join(', '));
      });
      document.removeEventListener('readystatechange', readystateHandler);
  }

  document.addEventListener('readystatechange', readystateHandler);
  // }
  // else {
  //   setTimeout(checkForJQuery, 1);
  // }
  window.scoutbookbuddyinitialized = true;

})(window);