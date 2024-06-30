
export const useUserStore =
  defineStore('user', () => {
  const email = ref("");
  const contextHandle = ref(-1);
  const loginPs = ref("");
  const sessionKey = ref("");
  const sessionKeyExpiration = ref(0);


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


  return {
    email, setEmail,
    contextHandle, setContextHandle,
    loginPs, makeLoginPs,
    sessionKey, setSessionKey, loadSessionKey, clearSessionKey,
    isLoggedIn,
    sessionKeyExpiration
  };
});
