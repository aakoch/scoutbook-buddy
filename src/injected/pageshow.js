/**
 * This is injected onto the page so we get jQuery events, specifically we need 'pageshow'
 */
$(document).on('pageshow.buddy', function (event) {
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
  window.postMessage(JSON.stringify(slimmedEvent));
});