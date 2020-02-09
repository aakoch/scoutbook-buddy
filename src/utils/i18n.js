import ext from "./extension";
document.querySelectorAll('[data-i18n]').forEach(el => {
  el.innerText = ext.i18n.getMessage(el.dataset.i18n)
})