import { set, get, del, clear, keys } from 'idb-keyval';

export const setSessionKey = async (key, value) => {
  if (import. meta. client) {
    await set(key, value);
  }
}

export const getSessionKey = async (key) => {
  if (import. meta. client) {
    return await get(key);
  }
}

export const deleteSessionKey = async (key) => {
  if (import. meta. client) {
    await del(key);
  }
}

export const clearAllKeys = async () => {
  if (import. meta. client) {
    await clear();
  }
}

export const getAllKeys = async () => {
  if (import. meta. client) {
    return await keys();
  }
}

export const setIdb = async (key, value) => {
  if (import. meta. client) {
    await set(key, value);
  }
}

export const getIdb = async (key) => {
  if (import. meta. client) {
    return await get(key);
  }
}

export const deleteIdb = async (key) => {
  if (import. meta. client) {
    await del(key);
  }
}
