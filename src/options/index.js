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

  let id = option.name;
  let label = option.label || chrome.i18n.getMessage(option.name + 'Label');
  let description = option.description || chrome.i18n.getMessage(option.name + 'Desc');

  let html = 
    `<li class="option">
      <input type="checkbox" id="${id}"> <label for="${id}">${label}</label>
      <div>${description}</div>
    </li>`;

  $('#optionsList').append(html);

  storage.get(id, function (resp) {
    // console.log(option + '? ' + !!resp[option]);
    if (!!resp[id]) {
      document.getElementById(id).setAttribute("checked", "checked");
    }
  });

  $('input#' + id).click(function (e) {
    $('#flash').finish();
    var value = e.target.checked;
    let obj = {};
    obj[id] = value;
    storage.set(obj, function () {
      if (chrome.runtime.lastError) {
        alert(chrome.runtime.lastError);
      } else {
        flash(chrome.i18n.getMessage('saved'));
      }
    });
  });
}

registerOption({name:'refreshOnLogout'});
registerOption({name:'useSBPreview'});

document
  .getElementById("close-btn")
  .addEventListener("click", function (e) {
    // $('body').fadeOut('fast', () => {
      window.close(); // inlining didn't work
    // })
    return false;
  });