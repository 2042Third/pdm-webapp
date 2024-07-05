import { set, get, del, clear, keys } from 'idb-keyval';
export  const useLocalStorage = () => {
  const useIndexedDB = async () => {
    if (import.meta.client) {
      try {
        await set('test-key', 'test-value');
        await del('test-key');
        return true;
      } catch (error) {
        console.warn('IndexedDB not available, falling back to localStorage');
        return false;
      }
    }
    return false;
  };

  const storage = async ()=> {
    await useIndexedDB() ? idbKeyval : localStorage;
  }

   const setStorage = async (key, value) => {
    if (import.meta.client) {
      if (storage === localStorage) {
        localStorage.setItem(key, JSON.stringify(value));
      } else {
        await set(key, value);
      }
    }
  };

   const getStorage = async (key) => {
    if (import.meta.client) {
      if (storage === localStorage) {
        return JSON.parse(localStorage.getItem(key));
      } else {
        return await get(key);
      }
    }
  };

   const clearStorage = async () => {
    if (import.meta.client) {
      if (storage === localStorage) {
        localStorage.clear();
      } else {
        await clear();
      }
    }
  }

   const removeStorage = async (key) => {
    if (import.meta.client) {
      if (storage === localStorage) {
        localStorage.removeItem(key);
      } else {
        await del(key);
      }
    }
  }

   const clearAllKeys = async () => {
    if (import. meta.client) {
      await clear();
    }
  }

   const getAllKeys = async () => {
    if (import. meta.client) {
      return await keys();
    }
  }

   const setIdb = async (key, value) => {
    if (import. meta.client) {
      await set(key, value);
    }
  }

   const getIdb = async (key) => {
    if (import. meta.client) {
      return await get(key);
    }
  }

   const deleteIdb = async (key) => {
    if (import. meta.client) {
      await del(key);
    }
  }
  return {
    setStorage,
    getStorage,
    clearStorage,
    removeStorage,
    clearAllKeys,
    getAllKeys,
    setIdb,
    getIdb,
    deleteIdb,
  }
}
