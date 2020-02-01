import browser from "../../utils/extension";
import storage from "../../utils/storage";
import logger from "../../utils/logger";
import "../../utils/i18n";
import $ from "jquery";
import './styles.scss';

logger.log(browser.tabs.query);

function flash(msg) {
  $('#flash').text(msg).show();
  setTimeout(() => {
    $('#flash').fadeOut();
  }, 1000);
}

storage.get('logging', function (resp) {
  if (resp.logging) {
    logger.log('logging enabled? ', resp.logging);
    document.getElementById('logging').setAttribute("checked", "checked");
  }
});

$('input').click(function (e) {
  $('#flash').hide();
  var value = e.target.checked;
  logger.log('logging enabled? ', value);
  storage.set({
    logging: value
  }, function () {
    if (browser.runtime.lastError) {
      alert(browser.runtime.lastError);
    } else {
      flash(browser.i18n.getMessage('saved'));
    }
  });
});
