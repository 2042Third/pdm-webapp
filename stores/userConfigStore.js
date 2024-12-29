
export const useUserConfigStore =
defineStore('userConfig', () => {
  const storesPasswordLocally = ref(false);
  const debugWindowOpen = ref(false);

  function setStoresPasswordLocally(value) {
    storesPasswordLocally.value = value;
  }

  function setDebugWindowOpen(value) {
    debugWindowOpen.value = value;
  }

  function toggleDebugWindowOpen() {
    debugWindowOpen.value = !debugWindowOpen.value;
  }

  return {
    storesPasswordLocally, setStoresPasswordLocally,
    debugWindowOpen, setDebugWindowOpen, toggleDebugWindowOpen,
  };
},


  {
  persist: true
    // [
    // {
    //   storage: localStorage,
    // },
    // {
    //   storage: sessionStorage,
    // },
  // ],
});
