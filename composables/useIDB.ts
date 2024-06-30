import { set, get, del, clear, keys } from 'idb-keyval';

export const setSessionKey = async (key, value) => {
  await set(key, value);
}

export const getSessionKey = async (key) => {
  return await get(key);
}

export const deleteSessionKey = async (key) => {
  await del(key);
}

export const clearAllKeys = async () => {
  await clear();
}

export const getAllKeys = async () => {
  return await keys();
}

export const setIdb = async (key, value) => {
  await set(key, value);
}

export const getIdb = async (key) => {
  return await get(key);
}
