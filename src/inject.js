import browser from "./utils/extension";
import logger from "./utils/logger";
import bbcode from 'bbcode';

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

var mySpecialButtonWasPressed = false;

if (!$("#dialogPage").length) {
  var $dialog = $('<div data-role="page" id="dialogPage"></div>').dialog();
  $("body").append($dialog);
}

// var $btna = $('<a href="#dialogPage" data-role="button" data-theme="a" data-rel="dialog">Preview a</a>');
var $btna = $('<button class="ui-btn ui-btn-a" data-role="button" data-theme="a">Preview Message</button>');
// var $btnb = $('<button class="ui-btn ui-btn-b" data-role="button" data-theme="b">Preview b</button>');
// var $btnc = $('<button class="ui-btn ui-btn-c" data-role="button" data-theme="c">Preview c</button>');
// var $btnd = $('<button class="ui-btn ui-btn-d" data-role="button" data-theme="d">Preview d</button>');
// var $btne = $('<button class="ui-btn ui-btn-e" data-role="button" data-theme="e">Preview e</button>');

var $div = $('#messageForm').append('<div></div>');
$div.append($btna); //.append($btnb).append($btnc).append($btnd).append($btne);

$btna.button({
  theme: "a"
});
// $btnb.button({
//   theme: "b"
// });
// $btnc.button({
//   theme: "c"
// });
// $btnd.button({
//   theme: "d"
// });
// $btne.button({
//   theme: "e"
// });

$btna
  // .add($btnb).add($btnc).add($btnd).add($btne)
  .mouseenter(function (e) {
    var $target = $(e.target);
    var theme = $target.data('theme');
    $target.closest('div').addClass('ui-btn-hover-' + theme);
  })
  .mouseleave(function (e) {
    var $target = $(e.target);
    var theme = $target.data('theme');
    $target.closest('div').removeClass('ui-btn-hover-' + theme);
  })
  .mousedown(function (e) {
    var $target = $(e.target);
    var theme = $target.data('theme');
    $target.closest('div').removeClass('ui-btn-hover-' + theme).addClass('ui-btn-down-' + theme);
  })
  .mouseup(function (e) {
    var $target = $(e.target);
    var theme = $target.data('theme');
    $target.closest('div').removeClass('ui-btn-down-' + theme).addClass('ui-btn-hover-' + theme);
  })
  .click((e) => {
    // e.stopImmediatePropagation();
    // e.preventDefault();
    // return false;
    mySpecialButtonWasPressed = true;
    var $target = $(e.target);
    setTimeout(() => {
      $target.closest('div').removeClass("ui-btn-active");
    }, 10);
  });

$('#messageForm').submit((e) => {
  if (mySpecialButtonWasPressed) {
    if ($('input[type=radio][name=MessageType] + .ui-radio-on').attr('title') === 'Send text message') {
      var closeBtn = $('<button class="ui-btn ui-btn-a" data-role="button" data-theme="a" data-inline="true">Close</button>');
      $('<div id="overlay" style="width:' + window.innerWidth + 'px;height:' + window.innerHeight + 'px;z-index:1001;position:fixed;top:0;left:0;background-color:white;color:black;padding:30px"><div><pre>' + $('#body').val() + '</pre></div></div>')
        .appendTo("body")
        .click(function (e) {
          $('#overlay').remove();
        })
        .append('<div id="asdf"></div>');
      $('#asdf').append(closeBtn);
      closeBtn.button({
        theme: "a"
      });
      closeBtn
        .mouseenter(function (e) {
          var $target = $(e.target);
          var theme = $target.data('theme');
          $target.closest('div').addClass('ui-btn-hover-' + theme);
        })
        .mouseleave(function (e) {
          var $target = $(e.target);
          var theme = $target.data('theme');
          $target.closest('div').removeClass('ui-btn-hover-' + theme);
        })
        .mousedown(function (e) {
          var $target = $(e.target);
          var theme = $target.data('theme');
          $target.closest('div').removeClass('ui-btn-hover-' + theme).addClass('ui-btn-down-' + theme);
        });
    } else {
      bbcode.parse($('#body').val(), function (content) {
        var closeBtn = $('<button class="ui-btn ui-btn-a" data-role="button" data-theme="a" data-inline="true">Close</button>');
        $('<div id="overlay" style="width:' + window.innerWidth + 'px;height:' + window.innerHeight + 'px;z-index:1001;position:fixed;top:0;left:0;background-color:white;color:black;padding:30px"><div>' + content + '</div></div>')
          .appendTo("body")
          .click(function (e) {
            $('#overlay').remove();
          })
          .append('<div id="asdf"></div>');
        $('#asdf').append(closeBtn);
        closeBtn.button({
          theme: "a"
        });
        closeBtn
          .mouseenter(function (e) {
            var $target = $(e.target);
            var theme = $target.data('theme');
            $target.closest('div').addClass('ui-btn-hover-' + theme);
          })
          .mouseleave(function (e) {
            var $target = $(e.target);
            var theme = $target.data('theme');
            $target.closest('div').removeClass('ui-btn-hover-' + theme);
          })
          .mousedown(function (e) {
            var $target = $(e.target);
            var theme = $target.data('theme');
            $target.closest('div').removeClass('ui-btn-hover-' + theme).addClass('ui-btn-down-' + theme);
          });
        //setTimeout(function () {$('#dialogPage').children('div').append(content);}, 1000);
        // $.mobile.changePage($dialog);
      });
    }
  }
  return !mySpecialButtonWasPressed;
});

logger.debug('inject.js loaded');