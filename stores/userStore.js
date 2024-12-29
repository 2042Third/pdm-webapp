
// Default user structure
function getDefaultUser() {
  return {
    id: -1,
    name: '',
    creation: 0,
    product: '',
    email: '',
    register_key: '',
    registered: 0
  }
}

function getDefaultSessionKey() {
  return {
    id: -1,
    sessionKey: ''  ,
    userid: -1 ,
    expirationTime: 0,
    expiration: 0,
    creationTime: 0,
    valid: '',
  }
}

export const useUserStore =
  defineStore('user', () => {
  const email = ref("");
  const contextHandle = ref(-1);
  const loginPs = ref("");
  const sessionKey = ref("");
  const sessionKeyExpiration = ref(0);
  const validationStatus = ref(false);
  const authAttempt = ref(0);
  const storageInitialized = ref(false);
  const refreshKey = ref("");
  const hasRefreshKey = ref(false);
  const refreshKeyExpiration = ref(0);
  const userData = reactive(getDefaultUser());
  const sessionKeyData = reactive(getDefaultSessionKey());

    /**
     * Update user data partially or entirely.
     * Object.assign merges the new data into userData,
     * preserving reactivity.
     */
    function setUserData(newData = {}) {
      Object.assign(userData, newData)
      email.value = userData.email;
    }

    /**
     * Reset the user object to the default values.
     */
    function resetUserData() {
      const defaults = getDefaultUser()
      Object.assign(userData, defaults)
    }

    const isLoggedIn = computed(()=>{
    return sessionKey.value && sessionKey.value !== "";
  });

  function setStorageInitialized(value) {
    storageInitialized.value = value
  }

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

  async function setSessionKey(key) {
    const nuxtApp = useNuxtApp();
    const {salt} = useSecurity();
    const storage = useLocalStorage();

    if (!storageInitialized){await storage.init();}
    Object.assign(sessionKeyData, key);
    Object.assign(sessionKeyData, {expiration: key.expiration});
    sessionKey.value = key.sessionKey;
    sessionKeyExpiration.value = key.expiration;
    await storage.setStorage("us", nuxtApp.$wasm.loader_check(salt(),JSON.stringify(key)));
    await storage.setStorage("usData", nuxtApp.$wasm.loader_check(salt(),JSON.stringify(sessionKeyData)));
  }

  async function loadSessionKey() {
    try {

      const nuxtApp = useNuxtApp();
      const {salt} = useSecurity();
      const storage = useLocalStorage();
      if (!storageInitialized){await storage.init();}

      const val = await storage.getStorage("us");
      if (!val || val === "" || val === "null" || val === "undefined") {
        return;
      }
      const parsedVal = JSON.parse(nuxtApp.$wasm.loader_out(salt(),val));
      sessionKey.value = parsedVal.sessionKey;
      sessionKeyExpiration.value = parsedVal.expirationTime;

      const valData = await storage.getStorage("usData");
      if (!valData || valData === "" || valData === "null" || valData === "undefined") {
        return;
      }
      const parsedValData = JSON.parse(nuxtApp.$wasm.loader_out(salt(),valData));
      Object.assign(sessionKeyData, parsedValData);
    }
    catch (e) {
      console.error("Error loading session key: ", e);

      return;
    }

  }

  async function clearSessionKey() {
    const storage = useLocalStorage();
    if (!storageInitialized){await storage.init();}
    sessionKey.value = "";
    await storage.removeStorage("us");
  }

  function makeLoginPs(value) {
    const nuxtApp = useNuxtApp();
    loginPs.value = nuxtApp.$wasm.get_hash(value+value);
  }

  async function  setRefreshKey(key) {
    const nuxtApp = useNuxtApp();
    const {salt} = useSecurity();
    const storage = useLocalStorage();
    if (!storageInitialized){await storage.init();}
    refreshKey.value = key.refreshKey;
    refreshKeyExpiration.value = key.refreshKeyExpirationTime;
    hasRefreshKey.value = true;
    await storage.setStorage("rk", nuxtApp.$wasm.loader_check(salt(),JSON.stringify(key)));
  }

  async function loadRefreshKey() {
    try {
      const nuxtApp = useNuxtApp();
      const {salt} = useSecurity();
      const storage = useLocalStorage();
      if (!storageInitialized){await storage.init();}
      const val = await storage.getStorage("rk");
      if (!val || val === "" || val === "null" || val === "undefined") {
        hasRefreshKey.value = false;
        return;
      }
      const parsedVal = JSON.parse(nuxtApp.$wasm.loader_out(salt(),val));
      refreshKey.value = parsedVal.refreshKey;
      refreshKeyExpiration.value = parsedVal.refreshKeyExpirationTime;
      hasRefreshKey.value = true;
    }
    catch (e) {
      console.error("Error loading refresh key: ", e);
      hasRefreshKey.value = false;
      return;
    }
  }

  async function clearRefreshKey() {
    const storage = useLocalStorage();
    if (!storageInitialized){await storage.init();}
    refreshKey.value = "";
    hasRefreshKey.value = false;
    await storage.removeStorage("rk");
  }

  async function storeLocalPassword (val ) {
    const nuxtApp = useNuxtApp();
    const {salt} = useSecurity();
    const storage = useLocalStorage();
    if (!storageInitialized){await storage.init();}
    await storage.setStorage("lp", nuxtApp.$wasm.loader_check(salt(),val));
  }

  async function retrieveLocalPassword ( ) {
    const nuxtApp = useNuxtApp();
    const {salt} = useSecurity();
    const storage = useLocalStorage();
    if (!storageInitialized){await storage.init();}
    const val = await storage.getStorage("lp");
    return  nuxtApp.$wasm.loader_out(salt(), val);
  }

  async function clearLocalPassword ( ) {
    const storage = useLocalStorage();
    if (!storageInitialized){await storage.init();}
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
    resetUserData();
    // await clearLocalPassword ();
    // await clearRefreshKey();
  }

  return {
    email, setEmail, resetUserData,
    sessionKeyData,
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
    storageInitialized, setStorageInitialized,
    refreshKey, setRefreshKey, loadRefreshKey, clearRefreshKey,
    hasRefreshKey, refreshKeyExpiration
  };
});
