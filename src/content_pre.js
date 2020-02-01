(async () => {
  const src = chrome.extension.getURL('scripts/contentscript.js');
  const contentScript = await import(src);
  contentScript.main(/* chrome: no need to pass it */);
})();