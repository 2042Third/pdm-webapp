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

  const performLogout = async (url) => {
    try {
      const response = await $fetch(url, {
        method: 'POST',
        headers: {
          "Session-Key": user.sessionKey,
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
          "Session-Key": user.sessionKey,
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

  return {
    performLogin,
    performLogout,
    performGetUserData,
  }

}
