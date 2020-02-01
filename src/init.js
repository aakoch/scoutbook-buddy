var s = document.createElement('span');
s.id = 'scoutbookbuddyextensionid';
s.style = 'display:none';
s.innerText = chrome.runtime.id;
(document.head || document.documentElement).appendChild(s);

var s = document.createElement('script');
s.src = chrome.extension.getURL('scripts/eventlisteners.js');
s.onload = function () {
  this.remove();
};
(document.head || document.documentElement).appendChild(s);