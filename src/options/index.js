import storage from "../utils/storage";
import "../utils/i18n";
import $ from "jquery";
import './styles.scss';

function flash(msg) {
  $('#flash').text(msg)
    .fadeIn(1000)
    .delay(500)
    .fadeOut(1000)
    // .css('display', 'block')
    // .delay(1)
    // .animate({borderRadius: '2em', top: 0, opacity: 1, left: '40%', height: '2em'}, 1000)
    // .delay(200)
    // .animate({borderRadius: 0, top: '-60px', opacity: 0, width: '1000%', left: '-400%', height: '1000%'}, 1200)
    // .css('display', 'none');
    // .css({position: 'absolute', left: 0, width:'20%', opacity: 0, display: 'block'})
    // .animate({width: '50%', opacity: 1, left: '20%'}, 1500)
    // .delay( 800 )
    // .animate({width: '20%', opacity: 0, left: '100%'}, 1500)
    // .animate({left: 0}, 1);
}

function registerOption(option) {

  storage.get(option, function (resp) {
    // console.log(option + '? ' + !!resp[option]);
    if (!!resp[option]) {
      document.getElementById(option).setAttribute("checked", "checked");
    }
  });

  $('input#' + option).click(function (e) {
    $('#flash').finish();
    var value = e.target.checked;
    // console.log(option + '? ' + value);
    let obj = {};
    obj[option] = value;
    // console.log('obj=', obj);
    storage.set(obj, function () {
      if (chrome.runtime.lastError) {
        alert(chrome.runtime.lastError);
      } else {
        flash(chrome.i18n.getMessage('saved'));
      }
    });
  });

}

registerOption('refreshOnLogout');
registerOption('useSBPreview');

document
  .getElementById("close-btn")
  .addEventListener("click", function (e) {
    // $('body').fadeOut('fast', () => {
      window.close(); // inlining didn't work
    // })
    return false;
  });