
export const useUserStore =
  defineStore('user', () => {
  const email = ref("");
  const contextHandle = ref(-1);
  const loginPs = ref("");
  const sessionKey = ref("");
  const sessionKeyExpiration = ref(0);
  const userData = ref(null);
  const validationStatus = ref(false);

  const isLoggedIn = computed(()=>{
    return sessionKey.value && sessionKey.value !== "";
  });

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
    const {setStorage } = useLocalStorage();
    sessionKey.value = key.sessionKey;
    sessionKeyExpiration.value = key.expirationTime;
    await setStorage("us", nuxtApp.$wasm.loader_check(salt(),JSON.stringify(key)));
  }

  async function loadSessionKey() {
    const nuxtApp = useNuxtApp();
    const {salt} = useSecurity();
    const {getStorage } = useLocalStorage();
    const val = await getStorage("us");
    if (!val || val === "" || val === "null" || val === "undefined") {
      return;
    }
    const parsedVal = JSON.parse(nuxtApp.$wasm.loader_out(salt(),val));
    sessionKey.value = parsedVal.sessionKey;
    sessionKeyExpiration.value = parsedVal.expirationTime;
  }

  async function clearSessionKey() {
    const {removeStorage} = useLocalStorage();
    sessionKey.value = "";
    await removeStorage("us");
  }

  function makeLoginPs(value) {
    const nuxtApp = useNuxtApp();
    loginPs.value = nuxtApp.$wasm.get_hash(value+value);
  }

  async function storeLocalPassword (val ) {
    const nuxtApp = useNuxtApp();
    const {salt} = useSecurity();
    const {setStorage } = useLocalStorage();
    await setStorage("lp", nuxtApp.$wasm.loader_check(salt(),val));
  }

  async function retrieveLocalPassword ( ) {
    const nuxtApp = useNuxtApp();
    const {salt} = useSecurity();
    const {getStorage} = useLocalStorage();
    const val = await getStorage("lp");
    return  nuxtApp.$wasm.loader_out(salt(), val);
  }

  async function clearLocalPassword ( ) {
    const {removeStorage} = useLocalStorage();
    await removeStorage("lp");
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
    validationStatus, setValidationStatus
  };
});
