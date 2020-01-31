// if (!document.buddyeventlistenerswindow) {

  jQuery.holdReady(true);
  document.buddyeventlistenerswindow = window;
  
  let events = [];
  let skipEvents = [
    'mouseout', 'mousemove', 'mouseover', 'mousewheel', 'mousedown', 'mouseup', 'mouseenter', 'mouseleave',
    'vmouseout', 'vmousemove', 'vmouseover',
    'pointerover', 'pointermove', 'pointerout', 'pointerrawupdate', 'pointerdown', 'pointerenter', 'pointerleave',
    'deviceorientationabsolute', 'scroll', 'wheel',
    'focus', 'blur',
    'keyup', 'keydown', 'keypress', 'input',
    'scrollstart', 'scrollstop'
  ];
  
  for (attr in window) {
    if (attr.indexOf('on') == 0) {
      if (!skipEvents.includes(attr.substring(2))) {
        events.push(attr);
        window.addEventListener(attr.substring(2), function (event) {
          console.log("window event", event.type);
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
        });
      }
    }
  }
  
  for (attr in $.event.global) {
    if (attr) {
      if (!skipEvents.includes(attr)) {
        events.push(attr);
        $(document).on(attr, function (event) {
          console.log("jquery event", event.type);
        });
      }
    }
  }
  
  
  // ['pageshow', 'beforepageshow'].forEach(attr => {
  //   events.push(attr);
  //   $(document).on(attr, function (event) {
  //     console.log("jquery event", event.type);
  //   });
  // })
  
  console.log('events registered:', events.join(', '));
  // }
  jQuery.holdReady(false);