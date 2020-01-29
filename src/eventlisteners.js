if (!document.buddyeventlistenerswindow) {

  document.buddyeventlistenerswindow = window;

  let events = [];

  for (attr in window) {
    if (attr.indexOf('on') == 0) {
      if (![
          'mouseout', 'mousemove', 'mouseover', 'mousewheel', 'mousedown', 'mouseup',
          'pointerover', 'pointermove', 'pointerout', 'pointerrawupdate', 'pointerdown',
          'deviceorientationabsolute', 'scroll', 'wheel',
          'focus', 'blur',
          'keyup', 'keydown', 'keypress', 'input'
        ].includes(attr.substring(2))) {
        events.push(attr);
        window.addEventListener(attr.substring(2), function (event) {
          console.log("window event", event.type);
        });
      }
    }
  }

  console.log('window events registered:', events.join(', '));
}