export const useUserStore =
  defineStore('user', () => {
  const email = ref("");
  const contextHandle = ref(-1);

  function setEmail(value) {
    email.value = value;
  }


  function setContextHandle(handle) {
    contextHandle.value = handle;
  }


  return { email, setEmail,
    contextHandle, setContextHandle,
  };
});
