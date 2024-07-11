export const appStatesStore =
defineStore('appStates', () => {
  const rightMenuOpen = ref(false);
  const leftMenuOpen = ref(false);
  const isLargeScreen = ref(true);
  const onPage = ref('home');

  function setOnPage (value) {
    onPage.value = value;
  }

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
    isLargeScreen, setIsLargeScreen,
    onPage, setOnPage,

  };

});
