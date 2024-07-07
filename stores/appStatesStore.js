export const appStatesStore =
defineStore('appStates', () => {
  const rightMenuOpen = ref(false);
  const leftMenuOpen = ref(false);
  const isLargeScreen = ref(true);

  function setRightMenu(value) {
    rightMenuOpen.value = value;
  }

  function setLeftMenu(value) {
    leftMenuOpen.value = value;
  }

  function setIsLargeScreen(value) {
    isLargeScreen.value = value;
  }

  return {
    rightMenuOpen,
    leftMenuOpen,
    setRightMenu,
    setLeftMenu,
    isLargeScreen, setIsLargeScreen

  };

});
