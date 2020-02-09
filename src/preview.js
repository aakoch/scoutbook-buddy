import bbcode from 'bbcode';
import './styles/common.scss'; // to get webpack to handle this
import document from 'document';
console.log('document', document);
import window from 'window';
var $ = window.$;

console.count('preview script started');

var mySpecialButtonWasPressed = false;

// var $btna = $('<a href="#dialogPage" data-role="button" data-theme="a" data-rel="dialog">Preview a</a>');
var $btna = $('<button class="ui-btn ui-btn-a buddy" data-role="button" data-theme="a">Preview Message</button>');
// var $btnb = $('<button class="ui-btn ui-btn-b" data-role="button" data-theme="b">Preview b</button>');
// var $btnc = $('<button class="ui-btn ui-btn-c" data-role="button" data-theme="c">Preview c</button>');
// var $btnd = $('<button class="ui-btn ui-btn-d" data-role="button" data-theme="d">Preview d</button>');
// var $btne = $('<button class="ui-btn ui-btn-e" data-role="button" data-theme="e">Preview e</button>');

var $div = $('#messageForm', document).append('<div></div>');
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
  .mouseenter(mouseEnter)
  .mouseleave(mouseLeave)
  .mousedown(mouseDown)
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


$('#messageForm', document).submit((e) => {
  if (mySpecialButtonWasPressed) {
    if ($('input[type=radio][name=MessageType] + .ui-radio-on', document).attr('title') === 'Send text message') {
      displayPreview('<pre>' + $('#body').val() + '</pre>');
    } else {
      bbcode.parse($('#body').val(), displayPreview);
    }
  }
  return !mySpecialButtonWasPressed;
});

function mouseDown(e) {
  var $target = $(e.target, document);
  var theme = $target.data('theme');
  $target.closest('div').removeClass('ui-btn-hover-' + theme).addClass('ui-btn-down-' + theme);
}

function mouseLeave(e) {
  var $target = $(e.target),
    document;
  var theme = $target.data('theme');
  $target.closest('div').removeClass('ui-btn-hover-' + theme);
}

function mouseEnter(e) {
  var $target = $(e.target, document);
  var theme = $target.data('theme');
  $target.closest('div').addClass('ui-btn-hover-' + theme);
}

function displayPreview(content) {
  content = content  || '[empty]';
  var overlayName = 'buddy-overlay';
  var closeBtn = $('<button class="ui-btn ui-btn-a buddy" data-role="button" data-theme="a" data-inline="true">Close</button>');
  var style = `
    #${overlayName} {
      width: 90%;
      height: ${window.innerHeight - 60}px;
      z-index:1001;
      position:fixed;
      top: 20px;
      left: 50%;

      background-color: white;
      color: black;
      padding: 20px 20px 5px 20px;
      z-index: 1001; 
      opacity: 0.9; 
      border: 2px solid black;
      transform: translateX(-50%);
    }
    #${overlayName} .msg-body {
      height: ${window.innerHeight - 190}px;
      overflow-y: auto;
      border-top: 10px solid;
      border-image-source: linear-gradient(45deg, rgb(0,143,104,255), rgb(250,224,66,255));
      border-image-slice: 1;
    }
    #${overlayName} .msg-subject, #${overlayName} .msg-body {
      margin: 10px
    }
    #btnContainer {
      width: 100px;
      margin: 0 auto;
    }
  `;

  var s = document.createElement('style');
  s.innerText = style;
  (document.head || document.documentElement).appendChild(s);
  let subject = $('#subject').text() || '[empty]';

  $(`<div id='${overlayName}'><div class="msg-subject"><em>Subject:</em> ${subject}</div><div style="margin-left:10px"><em>Body: </em></div><div class="msg-body">${content}</div></div>`)
    .appendTo("body", document)
    .append('<div id="btnContainer"></div>');

  $('#btnContainer').append(closeBtn);

  closeBtn
    .button({
      theme: "a"
    })
    .mouseenter(mouseEnter)
    .mouseleave(mouseLeave)
    .mousedown(mouseDown)
    .click(() => $('#' + overlayName, document)
    .fadeOut(() => $('#' + overlayName, document)
    .remove()));

  $(window).on('resize', () => $('#' + overlayName).width($('#body').width()));
}

// hides FA button
$("#buttonPreviewEmail").parent().hide();

