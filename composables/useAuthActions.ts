import {useUserStore} from "~/stores/userStore.js";

import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

export const useAuthAction = () => {
  const user = useUserStore();
  const userConfig = useUserConfigStore();
  const { email, loginPs } = storeToRefs(user);
  const router = useRouter();

  const performLogin = async (url) => {
    try {
      const loginData = {
        email: email.value,
        password: loginPs.value,
      };

      const response = await $fetch(url, {
        method: 'POST',
        body: loginData
      });

      console.log('Login response:', response);

      if (response && response.sessionKey) {
        await user.setSessionKey(response);
        return true;
      } else {
        console.error('Login failed: No session key received');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error.response ? error.response._data : error.message);
      // Handle error (e.g., show error message to user)
      return false;
    }
  }


  const performLoginWithRefresh = async (url, turnstileToken) => {
    try {
      const loginData = {
        email: email.value,
        password: loginPs.value,
        turnstileToken: turnstileToken,
      };

      const response = await $fetch(url, {
        method: 'POST',
        body: loginData,
        headers: {
          "SCOPE": "refresh"
        }
      });

      console.log('Login with Refresh response: ', response);

      if (response && response.sessionKey) {
        await user.setSessionKey(response);
        if (response.refreshKey) {
          await user.setRefreshKey(response);
          console.log("Received refresh key.");
        }
        return true;
      } else {
        console.error('Login with Refresh failed: No session key received');
        return false;
      }
    } catch (error) {
      console.error('Login with Refresh error:', error.response ? error.response._data : error.message);
      // Handle error (e.g., show error message to user)
      return false;
    }
  }

  const performSignup = async (url, turnstileToken) => {
    try {
      const signupData = {
        email: email.value,
        password: loginPs.value,
        turnstileToken: turnstileToken,
      };

      const response = await $fetch(url, {
        method: 'POST',
        body: signupData,
        headers: {}
      });

      console.log('Signup user: ', response);
      user.setLastSignupResponse(response);
      return {
        isSuccessful:true,
        data: response
      };

    } catch (error) {
      console.error('Signup error:', error.response ? error.response._data : error.message);
      // Handle error (e.g., show error message to user)
      return {
        isSuccessful:false,
        data: error.response ? error.response._data : error.message
      };
    }
  }
  const performSignupVerify = async (url, code) => {
    try {
      const signupVerifyData = {
        email: email.value,
        code: code,
      };

      const response = await $fetch(url, {
        method: 'POST',
        body: signupVerifyData,
        headers: {}
      });

      console.log('Signup verify response: ', response);
      // user.setLastSignupResponse(response);
      return {
        isSuccessful:true,
        data: response
      };

    } catch (error) {
      console.error('Signup verification error:', error.response ? error.response._data : error.message);
      // Handle error (e.g., show error message to user)
      return {
        isSuccessful:false,
        data: error.response ? error.response._data : error.message
      };
    }
  }


  const performLogout = async (url) => {
    try {
      const response = await $fetch(url, {
        method: 'GET',
        headers: {
          "Authorization": "Bearer " + user.sessionKey,
        }
      });

      console.log('Logout response:', response);

      if (response) {

        return true;
      } else {
        console.error('Logout error.');
        return false;
      }
    } catch (error) {
      console.error('Logout returned error: ', error.response ? error.response._data : error.message);
      // Handle error (e.g., show error message
      return false;
    }
  }

  const performGetUserData = async (url) => {
    try {
      const response = await $fetch(url, {
        method: 'GET',
        headers: {
          "Authorization": "Bearer " + user.sessionKey,
        }
      });

      console.log('Load User Data response:', response);

      if (response) {
        await user.setUserData(response);
        // router.push('/dashboard')
        return true;
      } else {
        console.error('Load User Data failed: No user data received');
        return false;
      }
    } catch (error) {
      console.error('Load User Data error:', error.response ? error.response._data : error.message);
      // Handle error (e.g., show error message
      return false;
    }
  };

  const performGetUserDataPOST = async (url) => {
    try {
      const response = await $fetch(url, {
        method: 'POST',
        headers: {
          "Authorization": "Bearer " + user.sessionKey,
        }
      });

      console.log('Load User Data response:', response);

      if (response) {
        await user.setUserData(response);
        // router.push('/dashboard')
        return true;
      } else {
        console.error('Load User Data failed: No user data received');
        return false;
      }
    } catch (error) {
      console.error('Load User Data error:', error.response ? error.response._data : error.message);
      // Handle error (e.g., show error message
      return false;
    }
  }


  const performCSRFGet = async (url) => {
    try {
      const response = await $fetch(url, {
        method: 'GET',
        headers: {
          "Authorization": "Bearer " + user.sessionKey,
        }
      });

      console.log('CSRF response.data:', response.data);

      if (response.data) {
        await user.setUserData(response.data);
        // router.push('/dashboard')
        // Get a specific cookie
        const xsrf = useCookie('XSRF-TOKEN')

        // Or access all cookies
        const cookies = useRequestHeaders(['cookie'])

        console.log("csrf call xsrf cookie: ", xsrf);
        console.log("all cookie: ", cookies);

        return true;
      } else {
        console.error('CSRF failed');
        return false;
      }
    } catch (error) {
      console.error('Load User Data error:', error.response ? error.response._data : error.message);
      // Handle error (e.g., show error message
      return false;
    }
  }

  const performValidation = async (url) => {
    try {
      const response = await $fetch(url, {
        method: 'GET',
        headers: {
          "Authorization": "Bearer " + user.sessionKey,
        }
      });

      console.log('Validation:', response);

      if (response) {
        user.setValidationStatus(true);

        return true;
      } else {
        console.error('Validation call failed');
        user.setValidationStatus(false);
        return false;
      }
    } catch (error) {
      console.error('Validation call returned error: ', error.response ? error.response._data : error.message);
      // Handle error (e.g., show error message
      user.setValidationStatus(false);
      return false;
    }
  }

  const performValidateRefreshKey = async (url) => {
    try {
      if (!user.refreshKey) {
        console.error('No refresh key found');
        return false;
      }
      const response = await $fetch(url, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + user.sessionKey,
        },
        body: {
          "refreshKey": user.refreshKey
        }
      });

      console.log('Validate Refresh Key:', response);

      if (response) {
        user.setValidationStatus(true);

        return true;
      } else {
        console.error('Validate Refresh Key call failed');
        user.setValidationStatus(false);
        return false;
      }
    } catch (error) {
      console.error('Validate Refresh Key call returned error: ', error.response ? error.response._data : error.message);
      // Handle error (e.g., show error message
      user.setValidationStatus(false);
      return false;
    }

  }

  const performRefreshSessionKey = async (url) => {
    try {
      if (!user.refreshKey) {
        console.error('No refresh key found');
        return false;
      }
      const response = await $fetch(url, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + user.sessionKey,
        },
        body: {
          "refreshKey": user.refreshKey
        }
      });

      console.log('Refresh Session Key:', response);

      if (response && response.sessionKey) {
        await user.setSessionKey(response);
        return true;
      } else {
        console.error('Refresh Session Key call failed');
        return false;
      }
    } catch (error) {
      console.error('Refresh Session Key call returned error: ', error.response ? error.response._data : error.message);
      // Handle error (e.g., show error message
      return false;
    }


  }

  async function performCallProtected () {
    try {
      const response = await $fetch('/protected', {
        method: 'GET',
        headers: {
          "Authorization": "Bearer " + user.sessionKey,
        }
      });

      console.log('Protected call response:', response);

      if (response) {
        return true;
      } else {
        console.error('Protected call failed');
        return false;
      }
    } catch (error) {
      console.error('Protected call returned error: ', error.response ? error.response._data : error.message);
      // Handle error (e.g., show error message
      return false;
    }
  }

  return {
    performLogin,
    performLoginWithRefresh,
    performSignup,
    performSignupVerify,
    performLogout,
    performGetUserData,
    performGetUserDataPOST,
    performCSRFGet,
    performValidation,
    performValidateRefreshKey,
    performRefreshSessionKey,
    performCallProtected,
  }

}
