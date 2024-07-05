import { set, get, del, clear, keys } from 'idb-keyval';

export const useLocalStorage = () => {
  let useIndexedDB = false;

  const testIndexedDB = async () => {
    if (import.meta.client) {
      try {
        await set('test-key', 'test-value');
        const value = await get('test-key');
        console.log("[useStorage.testIndexedDB] Testing getting \"test-key\" = " + value);
        if (value !== 'test-value') throw new Error('Test value mismatch');
        await del('test-key');
        return true;
      } catch (error) {
        console.warn('IndexedDB not available, falling back to localStorage:', error);
        return false;
      }
    }
    return false;
  };

  const init = async () => {
    try {
      useIndexedDB = await testIndexedDB();
    } catch (error) {
      console.error('Error initializing storage:', error);
      useIndexedDB = false;
    }
  };

  const setStorage = async (key, value) => {
    if (import.meta.client) {
      if (useIndexedDB) {
        await set(key, value);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    }
  };

  const getStorage = async (key) => {
    if (import.meta.client) {
      try {
        if (useIndexedDB) {
          console.log("[getStorage] Using indexedDB");
          return await get(key);
        } else {
          console.log("[getStorage] Using local storage");
          return JSON.parse(localStorage.getItem(key));
        }
      } catch (error) {
        console.error('Error getting from storage:', error);
        return null;
      }
    }
  };

  const clearStorage = async () => {
    if (import.meta.client) {
      if (useIndexedDB) {
        await clear();
      } else {
        localStorage.clear();
      }
    }
  };

  const removeStorage = async (key) => {
    if (import.meta.client) {
      if (useIndexedDB) {
        await del(key);
      } else {
        localStorage.removeItem(key);
      }
    }
  };

  const getAllKeys = async () => {
    if (import.meta.client) {
      if (useIndexedDB) {
        return await keys();
      } else {
        return Object.keys(localStorage);
      }
    }
    return [];
  };

  return {
    init,
    setStorage,
    getStorage,
    clearStorage,
    removeStorage,
    getAllKeys,
  };
};
