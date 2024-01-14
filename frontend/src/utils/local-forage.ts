import localForage from "localforage";

const db = localForage.createInstance({
  driver: localForage.INDEXEDDB,
  name: "audio-mvp-db",
  storeName: "audio-mvp",
  size: 5 * 1024 * 1024, // 5.24 MBs
  description: "audio-mvp-db",
});

export const indexedStorageDB = {
  db,
  getItem: db.getItem,
  setItem: db.setItem,
  removeItem: db.removeItem,
  clear: db.clear,
};
