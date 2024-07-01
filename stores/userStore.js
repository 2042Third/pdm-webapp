
export const useUserStore =
  defineStore('user', () => {
  const email = ref("");
  const contextHandle = ref(-1);
  const loginPs = ref("");
  const sessionKey = ref("");
  const sessionKeyExpiration = ref(0);
  const userData = ref(null);


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
  }

  async function setSessionKey(key) {
    const nuxtApp = useNuxtApp();
    const {salt} = useSecurity();
    sessionKey.value = key.sessionKey;
    sessionKeyExpiration.value = key.expirationTime;
    await setIdb("us", nuxtApp.$wasm.loader_check(salt(),JSON.stringify(key)));
  }

  async function loadSessionKey() {
    const nuxtApp = useNuxtApp();
    const {salt} = useSecurity();
    const val = await getIdb("us");
    if (!val || val === "" || val === "null" || val === "undefined") {
      return;
    }
    const parsedVal = JSON.parse(nuxtApp.$wasm.loader_out(salt(),val));
    sessionKey.value = parsedVal.sessionKey;
    sessionKeyExpiration.value = parsedVal.expirationTime;
  }

  async function clearSessionKey() {
    sessionKey.value = "";
    await deleteIdb("us");
  }

  function makeLoginPs(value) {
    const nuxtApp = useNuxtApp();
    loginPs.value = nuxtApp.$wasm.get_hash(value+value);
  }

  async function storeLocalPassword (val ) {
    const nuxtApp = useNuxtApp();
    const {salt} = useSecurity();
    await setIdb("lp", nuxtApp.$wasm.loader_check(salt(),val));
  }
  async function retrieveLocalPassword (val ) {
    const nuxtApp = useNuxtApp();
    const {salt} = useSecurity();
    return await setIdb("lp", nuxtApp.$wasm.loader_out(salt(), val));
  }
  async function clearLocalPassword ( ) {
    await deleteIdb("lp");
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
  };
});
