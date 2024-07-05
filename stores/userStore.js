
export const useUserStore =
  defineStore('user', () => {
  const email = ref("");
  const contextHandle = ref(-1);
  const loginPs = ref("");
  const sessionKey = ref("");
  const sessionKeyExpiration = ref(0);
  const userData = ref(null);
  const validationStatus = ref(false);
  const authAttempt = ref(0);

  const isLoggedIn = computed(()=>{
    return sessionKey.value && sessionKey.value !== "";
  });

  function addAuthAttempt() {
    authAttempt.value++;
  }

  function resetAuthAttempt() {
    authAttempt.value = 0;
  }

  function setEmail(value) {
    email.value = value;
  }

  function setContextHandle(handle) {
    contextHandle.value = handle;

  }

  function setUserData(data) {
    userData.value = data;
    email.value = data.email;
  }

  async function setSessionKey(key) {
    const nuxtApp = useNuxtApp();
    const {salt} = useSecurity();

    const storage = useLocalStorage();
    await storage.init();
    sessionKey.value = key.sessionKey;
    sessionKeyExpiration.value = key.expirationTime;
    await storage.setStorage("us", nuxtApp.$wasm.loader_check(salt(),JSON.stringify(key)));
  }

  async function loadSessionKey() {
    try {

      const nuxtApp = useNuxtApp();
      const {salt} = useSecurity();
      const storage = useLocalStorage();
      await storage.init();
      const val = await storage.getStorage("us");
      if (!val || val === "" || val === "null" || val === "undefined") {
        return;
      }
      const parsedVal = JSON.parse(nuxtApp.$wasm.loader_out(salt(),val));
      sessionKey.value = parsedVal.sessionKey;
      sessionKeyExpiration.value = parsedVal.expirationTime;
    }
    catch (e) {
      console.error("Error loading session key: ", e);

      return;
    }

  }

  async function clearSessionKey() {
    const storage = useLocalStorage();
    await storage.init();
    sessionKey.value = "";
    await storage.removeStorage("us");
  }

  function makeLoginPs(value) {
    const nuxtApp = useNuxtApp();
    loginPs.value = nuxtApp.$wasm.get_hash(value+value);
  }

  async function storeLocalPassword (val ) {
    const nuxtApp = useNuxtApp();
    const {salt} = useSecurity();
    const storage = useLocalStorage();
    await storage.init();
    await storage.setStorage("lp", nuxtApp.$wasm.loader_check(salt(),val));
  }

  async function retrieveLocalPassword ( ) {
    const nuxtApp = useNuxtApp();
    const {salt} = useSecurity();
    const storage = useLocalStorage();
    await storage.init();
    const val = await storage.getStorage("lp");
    return  nuxtApp.$wasm.loader_out(salt(), val);
  }

  async function clearLocalPassword ( ) {
    const storage = useLocalStorage();
    await storage.init();
    await storage.removeStorage("lp");
  }

  function setValidationStatus(status) {
    validationStatus.value = status;
  }


  async function clearAll() {
    email.value = "";
    contextHandle.value = -1;
    loginPs.value = "";
    sessionKey.value = "";
    sessionKeyExpiration.value = 0;
    await clearSessionKey();
    await clearLocalPassword ();
  }

  return {
    email, setEmail,
    contextHandle, setContextHandle,
    loginPs, makeLoginPs,
    sessionKey, setSessionKey, loadSessionKey, clearSessionKey,
    isLoggedIn,
    sessionKeyExpiration,
    storeLocalPassword, retrieveLocalPassword, clearLocalPassword,
    userData, setUserData,
    clearAll,
    validationStatus, setValidationStatus,
    authAttempt, addAuthAttempt,
  };
});
