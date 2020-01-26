import browser from "./utils/extension";
import logger from "./utils/logger";

logger.debug("entering inject.js");

function setupListener() {
  window.addEventListener('message', handleMessage);
  logger.debug('listener set up on page');
}

function handleMessage(request) {
  logger.debug("inject.js handleMessage(): request=", request);
  browser.runtime.sendMessage(document.getElementById('scoutbookbuddyextensionid').innerText, request);
}

setupListener();

logger.debug('inject.js loaded');