import browser from "./extension";

export default (browser.storage.sync ? browser.storage.sync : browser.storage.local);