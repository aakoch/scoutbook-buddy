import browser from "./utils/extension";
import $ from "jquery";
import logger from "./utils/logger";

// 'ui-btn-up-e' is misleading because the site uses the up button from the "e" template 
// to signify it is "down" or selected.
// Inversely, 'ui-btn-up-d' means the button is 'up' and not selected.
const CHECKBOX_UNSELECTED_CLASS = 'ui-btn-up-d';
const CHECKBOX_SELECTED_CLASS = 'ui-btn-up-e';

(function () {
  function addFooterIndicator() {
    // TODO: move the style into a SASS file
    $("body", document)
      .prepend("<div id='scoutbookbuddyindicator' style='font-family: \"Roboto\", sans-serif; font-weight: normal; font-size: 12px; position: fixed; bottom: 0; right: 5px; opacity: 30%; z-index: 1'>Scoutbook Buddy Activated</div>");
  }
  addFooterIndicator();

  const getCount = () => {
    const size = $(document).find('.ui-page-active li.ui-btn-up-e').filter(".leader,.parent,.scout").length;
    return {
      count: size
    };
  }

  let indicatorTimeout;

  function handleMessage(request, sender, sendResponse) {
    logger.info("contentscript.js handleMessage(): request=", request, ", sender=", sender);

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
          logger.info("scoutbook buddy indicator not found");
          addFooterIndicator();
        } else {
          logger.info("scoutbook buddy indicator found");
        }
      }, 600); // not sure the wait is needed anymore now that I have the MutationObserver
    } else if (request.action === 'heartbeat') {
      logger.info('heartbeat received');
      // setTimeout(sendResponse, 1000);
    } else if (request.action === 'restore-message') {
      setTimeout(function () {
        $('#subject', document).val(request.subject);
        $('#body', document).val(request.body);
      }, 600); // not sure the wait is needed anymore now that I have the MutationObserver
    } else {
      logger.info('Unrecognized request recieved in content script. request=', request);
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
      $selectAllLink.text('Unselect All');
    } else {
      $selectAllLink.text('Select All');
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
      $selectAllLink.text('Unselect All');
    } else {
      $selectAllLink.text('Select All');
    }
  });

  $(document).on('click', '.ui-btn,#buttonSubmit', function (e) {
    logger.debug('contentscript.js radio or submit button was clicked - should we save the email?');
    // TODO: 'keepContentID' is part of sbfa so this will only work if it is there
    if (document.getElementById('keepContentID') && document.getElementById('keepContentID').checked) {
      const subject = $('#subject', document).val();
      const body = $('#body', document).val();
      const request = {
        'action': 'save-message',
        'subject': subject,
        'body': body
      };
      browser.runtime.sendMessage(browser.runtime.id, request);
    }
  });

  // *****************************************************************************
  // Need to put this pageshow code into another file and maybe add a custom event
  let pageShowTimeout;

  let observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.attributeName === "class") {
        let attributeValue = $(mutation.target).prop(mutation.attributeName);
        if (attributeValue.includes('ui-mobile-viewport-transitioning')) {
          // don't do anything
        }
        else {
          logger.debug("pageshow event might have taken place");
          clearTimeout(pageShowTimeout);
          pageShowTimeout = setTimeout(() => {
            browser.runtime.sendMessage(browser.runtime.id, {event: 'pageshow'});
          }, 200);
        }
      }
    });
  });
  observer.observe($("body")[0], {
    attributes: true
  });
  // *****************************************************************************

  browser.runtime.onMessage.addListener(handleMessage);

  // not sure I need this anymore now that I have the MutationObserver
  (window || self).addEventListener('message', function (e) {
    logger.debug('contentscript.js window message received. Event=', e);
  });

  logger.debug('contentscript.js loaded');
})();