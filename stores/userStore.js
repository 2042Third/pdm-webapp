export const useUserStore =
  defineStore('user', () => {
  const email = ref("");
  const password = ref("");
  const contextHandle = ref(-1);

  function setEmail(value) {
    email.value = value;
  }
  function setPassword(value) {
    password.value = value;
  }

  function setContextHandle(handle) {
    contextHandle.value = handle;
  }


  return { email, password, contextHandle,
    setEmail, setPassword,
    setContextHandle
  };
});
