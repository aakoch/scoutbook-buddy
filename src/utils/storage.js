import ext from "./extension";

export default (ext.storage.sync ? ext.storage.sync : ext.storage.local);