import document from 'document';
import jQuery from 'jquery';
import browser from './utils/extension';
import './styles/contentscript.scss';
var $ = jQuery;

browser.runtime.sendMessage(browser.runtime.id, JSON.stringify({action:'inject-progress-page'}));

// import Logger from './utils/logger';
// const logger = Logger.create('contentscript');

// var port = chrome.runtime.connect({name: "contentscript"});

// port.onMessage.addListener(function(msg) {
//   console.log("port on message", msg);
// });

// port.postMessage(JSON.stringify({msg: 'anybody listening?'}));

// port.onDisconnect.addListener(function(msg) {
//   console.log('Port closed');
// });

// 'ui-btn-up-e' is misleading because the site uses the up button from the "e" template 
// to signify it is "down" or selected.
// Inversely, 'ui-btn-up-d' means the button is 'up' and not selected.
const CHECKBOX_UNSELECTED_CLASS = 'ui-btn-up-d';
const CHECKBOX_SELECTED_CLASS = 'ui-btn-up-e';

function addFooterIndicator() {
  $("body", document)
    .prepend(`<div id='scoutbookbuddyindicator' title='The Scoutbook Buddy extension is enhancing your Scoutbook experience'>Buddy Activated <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
      <circle cx="5" cy="5" r="5"/>
    </svg></div>`);
}
addFooterIndicator();

const getCount = () => {
  const size = $(document).find('.buddy-feature').length;
  return {
    count: size
  };
}

let indicatorTimeout;

function handleMessage(request, sender, sendResponse) {

  if (typeof request === 'object')
    return true;

  try {
    request = JSON.parse(request);
  } catch (e) {
    if (request.msg) { // && request.msg.startsWith('{"hostx":"www.","text":"RestartSession","sensitive":"yes","url":"https://www.scoutbook.com/mobile/dashboard/messages/default.asp?UnitID')) {
      // for messages from scoutbook site
      portHandler(request.msg, sender, sendResponse);
    } else {
      logger.warn("parse error", e, request);
    }
    return true;
  }

  // TODO: can we put the actions into a map with the key as the action and the function as the value?
  if (request.action === 'process-page') {
    sendResponse(gatherPageInformation());
    return true;
  } else if (request.action === 'get-selected-count') {
    sendResponse(getCount());
    return true;
  } else if (request.action === 'add-footer-indicator') {
    clearTimeout(indicatorTimeout);
    indicatorTimeout = setTimeout(function () {
      if (!$('#scoutbookbuddyindicator', document).length) {
        console.log("scoutbook buddy indicator not found");
        addFooterIndicator();
      } else {
        console.log(new Date(), "scoutbook buddy indicator found");
      }
    }, 600); // not sure the wait is needed anymore now that I have the MutationObserver
  } else if (request.action === 'heartbeat') {
    console.log('heartbeat received');
    // setTimeout(sendResponse, 1000);
  } else if (request.action === 'restore-message') {
    setTimeout(function () {
      $('#subject', document).val(request.subject);
      $('#body', document).val(request.body);
    }, 600); // not sure the wait is needed anymore now that I have the MutationObserver
  } else {
    console.log('Unrecognized request recieved in content script. request=', request);
    return true;
  }
}

$(document).on('click', '.selectAllLeaders,.selectAllParents,.selectAllScouts', function (e) {
  const $selectAllLink = $(this);
  let selector = 'li.';

  // TODO: probably can just get the class and to a substring to get the selector. Of course, we also 
  // need the selectors to filter on the event.
  if ($selectAllLink.hasClass("selectAllLeaders")) {
    selector += 'leader';
  } else if ($selectAllLink.hasClass("selectAllParents")) {
    selector += 'parent';
  } else if ($selectAllLink.hasClass("selectAllScouts")) {
    selector += 'scout';
  }

  selector += '.checkable.' + CHECKBOX_UNSELECTED_CLASS;

  let allChecked = $(selector, document).length == 0; // zero unchecked means they are all checked
  if (allChecked) {
    $selectAllLink.text(browser.i18n.getMessage('unselectAllAction'));
  } else {
    $selectAllLink.text(browser.i18n.getMessage('selectAllAction'));
  }
});

$(document).on('click', 'li.checkable', function (e) {
  const $person = $(this);
  let selector = '.selectAll';

  if ($person.hasClass("leader")) {
    selector += 'Leaders';
  } else if ($person.hasClass("parent")) {
    selector += 'Parents';
  } else if ($person.hasClass("scout")) {
    selector += 'Scouts';
  }

  let $selectAllLink = $(selector, document);

  // zero unchecked means they are all checked
  const allChecked = $person.siblings('.checkable').filter('.' + CHECKBOX_UNSELECTED_CLASS).length == 0 &&
    $person.hasClass(CHECKBOX_SELECTED_CLASS);
  if (allChecked) {
    $selectAllLink.text(browser.i18n.getMessage('unselectAllAction'));
  } else {
    $selectAllLink.text(browser.i18n.getMessage('selectAllAction'));
  }
});

$(document).on('pageshow.buddy', function (event) {
  if (document.location.pathname.includes('messages/default.asp')) {
    const request = {
      'action': 'inject-preview-page'
    };
    browser.runtime.sendMessage(browser.runtime.id, JSON.stringify(request));
  }
})

$(document).on('click', '.ui-btn,#buttonSubmit', function (e) {
  if (document.location.pathname.includes('messages/default.asp')) {
    // console.log('contentscript.js radio or submit button was clicked - should we save the email?');
    // TODO: 'keepContentID' is part of sbfa so this will only work if it is there
    if (document.getElementById('keepContentID') && document.getElementById('keepContentID').checked) {
      const subject = $('#subject', document).val();
      const body = $('#body', document).val();
      const request = {
        'action': 'save-message',
        'subject': subject,
        'body': body
      };
      browser.runtime.sendMessage(browser.runtime.id, JSON.stringify(request));
      browser.runtime.sendMessage(browser.runtime.id, JSON.stringify({
        event: 'inject-page-listeners',
        source: 'click'
      }));
    }
  }
});

// *****************************************************************************
// Need to put this pageshow code into another file and maybe add a custom event
// wrapped in a function to limit variables escaping
// (function (document) {
//   // passing in the startTime like this is me just trying to be clever.
//   (function registerPageShowListener(document, startTime) {
//     console.count('registerPageShowListener');
//     if (document.mobile) {
//       console.count('document.mobile ready after ' + (Date.now() - startTime) + ' milliseconds');
//       let observer = new MutationObserver(function (mutations) {
//         mutations
//           .filter(mutation => mutation.attributeName === "class")
//           .forEach(function (mutation) {
//             let attributeValue = $(mutation.target).prop(mutation.attributeName);
//             console.log('active page attribute change: ' + attributeValue);
//             // if (attributeValue.includes('ui-mobile-viewport-transitioning')) {
//             //   // don't do anything
//             // } else {
//             //   console.log(new Date(), "pageshow event might have taken place", attributeValue,
//             //     mutation.oldValue);
//             //   browser.runtime.sendMessage(browser.runtime.id, JSON.stringify({
//             //     event: 'pageshow',
//             //     source: 'mutationObserver',
//             //     pageId: $('.ui-page-active', document).attr('id'),
//             //     url: document.location.href
//             //   }));
//             // }
//         });
//       });
//       observer.observe($(".activePage", document)[0], {
//         attributes: true,
//         attributeOldValue: true
//       });
//     } else {
//       setTimeout(() => registerPageShowListener(startTime), 1);
//     }
//   })(document, Date.now());
// })(document);
// observer.observe($(document)[0], {
//   attributes: true,
//   attributeOldValue: true
// });
// *****************************************************************************

browser.runtime.onMessage.addListener(handleMessage);

// not sure I need this anymore now that I have the MutationObserver
// actually, this won't work because window isn't available to contentscripts
(window || self).addEventListener('message', function (e) {
  console.log('contentscript.js window message received. Event=', e);
  if (typeof e.data == 'string') {
    let data;
    try {
      data = JSON.parse(e.data);
    } catch (e) {
      console.log(e);
      return false;
    }
    if (data.event == 'pageshow') {
      console.log('pageshow event caught in contentscript');
      $(document).trigger('pageshow.buddy');
      browser.runtime.sendMessage(browser.runtime.id, JSON.stringify({
        event: 'pageshow',
        pageId: $('.ui-page-active', document).attr('id'),
        url: document.location.href,
        source: 'contentscript'
      }));
    }
  }
});

// var port = chrome.runtime.connect({name: "knockknock"});
// port.postMessage({joke: "Knock knock"});
// port.onMessage.addListener(function(msg) {
//   if (msg.question == "Who's there?")
//     port.postMessage({answer: "Madame"});
//   else if (msg.question == "Madame who?")
//     port.postMessage({answer: "Madame... Bovary"});
// });

window.addEventListener('beforeunload', function (e) {
  let backgroundTasksAreRunning = false;
  if (backgroundTasksAreRunning) {
    // Cancel the event
    e.preventDefault();
    // Chrome requires returnValue to be set
    e.returnValue = '';
  }
});

console.log('contentscript.js loaded');

// }

//jQuery.noConflict(true);