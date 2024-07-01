
export const useUserConfigStore =
defineStore('userConfig', () => {
  const storesPasswordLocally = ref(false);

  function setStoresPasswordLocally(value) {
    storesPasswordLocally.value = value;
  }

  return {
    storesPasswordLocally, setStoresPasswordLocally
  };
});
