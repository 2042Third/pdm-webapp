export const useApiStore =
  defineStore('api', () => {
    const api_base = ref("http://10.0.0.189");
    const api_signin = ref("/login");
    const api_signout = ref("/logout");
    const api_signup = ref("/signup");
    const api_notes = ref("/api/notes");
    const api_get_user = ref("/api/user");

    const signin_url = computed(() => api_base.value + api_signin.value);
    const signout_url = computed(() => api_base.value + api_signout.value);
    const get_notes_url = computed(() => api_base.value + api_notes.value);
    const get_user_url = computed(() => api_base.value + api_get_user.value);

    function setApiBase(value) {
      api_base.value = value;
    }

    return {
      signin_url,
      signout_url,
      get_notes_url,
      get_user_url,
    };
  });
