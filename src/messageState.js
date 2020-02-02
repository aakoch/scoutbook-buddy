import document from 'document';

import Logger from './utils/logger';
const logger = Logger.create('messageState');


function handleMessage(request, sender, sendResponse) {
  let requestObj;
  try {
    requestObj = JSON.parse(request);
  } catch (e) {
    if (request.msg) { // && request.msg.startsWith('{"hostx":"www.","text":"RestartSession","sensitive":"yes","url":"https://www.scoutbook.com/mobile/dashboard/messages/default.asp?UnitID')) {
      // for messages from scoutbook site
      handleMessage(request.msg, sender, sendResponse);
    } else {
      logger.warn("parse error", e, request);
    }
    return true;
  }

  if (requestObj.action === 'restore-message') {
    logger.info('in restore-message');
    var promise = new Promise(resolve, reject)
      .then(() => {
        document.getElementById('subject').value = request.subject;
        document.getElementById('body').value = request.body;
      });
  } else if (requestObj.action === 'pageshow') {
    logger.info('in pageshow');
    resolve();
  } else {
    logger.debug('Unrecognized request recieved in messageState.js. request=', request);
    return true;
  }
}

document.addEventListener('click', function (e) {
  if (document.location.pathname.includes('messages/default.asp') &&
    (
      e.target.classList.contains('ui-btn') ||
      e.target.id == 'buttonSubmit' ||
      e.target.parentNode.classList.contains('ui-btn') ||
      e.target.parentNode.id == 'buttonSubmit'
    )) {
    // logger.debug('contentscript.js radio or submit button was clicked - should we save the email?');
    // TODO: 'keepContentID' is part of sbfa so this will only work if it is there
    if (document.getElementById('keepContentID') && document.getElementById('keepContentID').checked) {
      const subject = document.getElementById('subject').value;
      const body = document.getElementById('body').value;
      const request = {
        'action': 'save-message',
        'subject': subject,
        'body': body
      };
      chrome.runtime.sendMessage(chrome.runtime.id, JSON.stringify(request));
    }
  }
});

chrome.runtime.onMessage.addListener(handleMessage);

logger.info('messageState.js loaded');