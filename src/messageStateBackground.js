let injected = false;
let injectedTimeout;

function handleMessage(request, sender, sendResponse) {
  if (request.action == 'save-message') {
    console.log(new Date().toISOString(), ": messageStateBackground.js save-message mesage received. request=", request, ", sender=", sender);
    let message = {
      'action': 'restore-message',
      'subject': request.subject,
      'body': request.body
    };
    sendMessage(message)
  } else {
    console.log(new Date(), ": messageStateBackground.js mesage received. request=", request, ", sender=", sender);
  }
}

function sendMessage(message) {
  chrome.tabs.query({
    active: true,
    url: '*://*.scoutbook.com/*'
  }, function (tabs) {
    if (tabs.length > 0) {
      chrome.tabs.sendMessage(tabs[0].id, message, function (sendResponse) {
        if (chrome.runtime.lastError) {
          console.log('Error: ', chrome.runtime.lastError.message);
        } else {
          console.log('done making call in background', r);
        }
      });
    }
  });
}

chrome.runtime.onMessage.addListener(handleMessage);