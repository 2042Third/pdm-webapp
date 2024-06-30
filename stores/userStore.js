export const useUserStore =
  defineStore('user', () => {
  const email = ref("");
  const contextHandle = ref(-1);
  const loginPs = ref("");
  const sessionKey = ref("");


  const isLoggedIn = computed(()=>{
    return sessionKey.value && sessionKey.value !== "";
  });

  function setEmail(value) {
    email.value = value;
  }

  function setContextHandle(handle) {
    contextHandle.value = handle;

  }

  async function setSessionKey(key) {
    sessionKey.value = key;
    await setIdb("us", key);
  }

  function makeLoginPs(value) {
    const nuxtApp = useNuxtApp();
    loginPs.value = nuxtApp.$wasm.get_hash(value+value);
  }

  async function loadSessionKey() {
    sessionKey.value = await getIdb("us");
  }

  return {
    email, setEmail,
    contextHandle, setContextHandle,
    loginPs, makeLoginPs,
    sessionKey, setSessionKey, loadSessionKey,
    isLoggedIn,
  };
});
