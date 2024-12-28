import {ref} from "vue";

export const appStatesStore =
defineStore('appStates', () => {
  const rightMenuOpen = ref(false);
  const leftMenuOpen = ref(false);
  const isLargeScreen = ref(true);
  const showDebug = ref(false)
  const onPage = ref('home');

  function setShowDebug(value) {
    showDebug.value = value;
  }

  function toggleShowDebug() {
    showDebug.value = !showDebug.value;
  }

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

    showDebug, setShowDebug, toggleShowDebug,
    rightMenuOpen,
    leftMenuOpen,
    setRightMenu,
    setLeftMenu,
    isLargeScreen, setIsLargeScreen,
    onPage, setOnPage,

  };

});
