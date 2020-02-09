/**
 * This is injected onto the page so we get the 'pageshow' jQuery event.
 * There was a time I was logged out after a while and when I logged back in
 * the $ wasn't available and my script failed. This adds a loop to keep trying
 * although now I'm not getting the issue.
 */
// wrapped in a function to limit variables escaping
(function () {
  // passing in the startTime like this is me just trying to be clever.
  (function registerPageShowListener(startTime) {
    // console.count('registerPageShowListener')
    if (window.$) {
      console.count('$ ready after ' + (Date.now() - startTime) + ' milliseconds');
      $(document).on('pageshow.buddy', function (event) {
        console.log('pageshow event caught in pageshow.js');

        // preliminary event to pass
        let slimmedEvent = {
          target: {
            innerText: event.target.innerText,
            innerHTML: event.target.innerHTML,
            id: event.target.id,
            classList: event.target.classList
          },
          event: event.type,
          pageId: $.mobile.activePage.attr('id'),
          url: document.location.href,
          source: 'pageshow'
        };
        window.postMessage(JSON.stringify(slimmedEvent), '*');
      });
    } else {
      setTimeout(() => registerPageShowListener(startTime), 1);
    }
  })(Date.now());
})();