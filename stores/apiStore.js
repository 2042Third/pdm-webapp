export const useApiStore =
  defineStore('api', () => {
    const api_base = ref("http://10.0.0.189");
    const api_signin = ref("/login");
    const api_signup = ref("/signup");

    const signin_url = computed(() => api_base.value + api_signin.value);


    function setApiBase(value) {
      api_base.value = value;
    }

    return {
      signin_url,
    };
  });
