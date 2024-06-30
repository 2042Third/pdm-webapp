import {useUserStore} from "~/stores/userStore.js";

import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

export const useLoginAction = () => {
  const user = useUserStore();
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
        // router.push('/dashboard')
      } else {
        console.error('Login failed: No session key received');
      }
    } catch (error) {
      console.error('Login error:', error.response ? error.response._data : error.message);
      // Handle error (e.g., show error message to user)
    }
  }

  return { performLogin }
}
