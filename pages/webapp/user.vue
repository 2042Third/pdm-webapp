<template>
    <div class="flex flex-col  gap-6 mb-6 justify-center items-center ">
      <CommonContainerDotted containerClass="max-w-prose w-full" innerClass="flex flex-col gap-4"><client-only>
        <CommonInputS
            v-if="!user.isLoggedIn"
            id="user-email"
            v-model="input_email"
            type="text"
            class="w-full h-full"
            :class="{ 'border-red-500': showError }"
            :on-enter="login"
            placeholder="Email"
        />

        <CommonInputS
            v-if="!user.isLoggedIn"
            id="user-ps"
            v-model="input_password"
            type="password"
            class="w-full h-full"
            :class="{ 'border-red-500': showError }"
            :on-enter="login"
            placeholder="Password"
        />

        <div
            v-if="showError"
            class="text-red-500 text-sm mb-2 transition-all duration-300 ease-in-out"
            :class="{ 'shake-animation': showError }"
        >
          Incorrect email or password. Please try again.
        </div>

        <UButton
            v-if="!user.isLoggedIn"
            @click="login()"
            :loading="isLoading"
            :disabled="isLoading"
            class="w-full h-full text-white place-content-center
                 basis-1/5 bg-blue-700 hover:bg-blue-800
                 focus:ring-4 focus:outline-none focus:ring-blue-300
                 font-medium rounded-lg text-sm
                 px-5 py-2.5 text-center dark:bg-blue-600
                 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            :class="{ 'shake-animation': showError }"
        >
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </UButton>

        <UButton
            v-if="user.isLoggedIn"
            @click="logout()"
            class="w-full h-full text-white place-content-center
                     basis-1/5 bg-blue-700 hover:bg-blue-800
                     focus:ring-4 focus:outline-none focus:ring-blue-300
                     font-medium rounded-lg text-sm
                     px-5 py-2.5 text-center dark:bg-blue-600
                     dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Logout
        </UButton>
      </client-only>
      </CommonContainerDotted>


    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useNotesStore } from '~/stores/notesStore'

const [parent] = useAutoAnimate();


const nuxtApp = useNuxtApp();
const user = useUserStore();
const api = useApiStore();
const notes = useNotesStore();
const userConfig = useUserConfigStore();
const { performLogin, performLoginWithRefresh, performValidateRefreshKey,
  performLogout, performValidation, performRefreshSessionKey,
  performCallProtected
} = useAuthAction();
const { performGetNotes } = useNotesAction();
const { unixToHumanReadableTime } = useUtil();

const input_email = ref("");
const input_password = ref("");
const isLoading = ref(false);
const showError = ref(false);

user.$subscribe((mutation, state) => {
  input_email.value = state.email;
})

function createContext() {
  const ctx = nuxtApp.$wasm.create_context(input_password.value);
  console.log("new = " + ctx);
  user.setContextHandle(ctx);
}

async function login() {
  isLoading.value = true;
  showError.value = false;
  try {
    user.setEmail(input_email.value);
    createContext();
    user.makeLoginPs(input_password.value);
    if (await performLoginWithRefresh(api.signin_url)) {
    // if (await performLogin(api.signin_url)) {
      if (userConfig.storesPasswordLocally) {
        await user.storeLocalPassword(input_password.value);
      }
    } else {
      showError.value = true;
      setTimeout(() => {
        showError.value = false;
      }, 3000); // Hide error message after 3 seconds
    }
  } catch (error) {
    console.error('Login failed:', error);
    showError.value = true;
    setTimeout(() => {
      showError.value = false;
    }, 3000); // Hide error message after 3 seconds
  } finally {
    isLoading.value = false;
  }
}

async function logout() {
  await performLogout(api.signout_url);
  await user.clearAll();
}

function getNotes() {
  performGetNotes(api.get_notes_url);
}

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};

const userDataStatus = ref(false);
const {performGetUserData, performGetUserDataPOST} = useAuthAction();

async function getUserData(){
  userDataStatus.value = await performGetUserData(api.get_user_url);
  console.log("[User page] UserData" + user.userData);
}

async function getUserDataPOST(){
  userDataStatus.value = await performGetUserDataPOST(api.get_user_url);
  console.log("[User page] UserDataPOST" + user.userData);
}

async function getValidation () {
  await performValidation(api.get_validation_url);
}

async function getValidationRefreshKey () {
  await performValidateRefreshKey(api.get_validation_url);
}

async function refreshSessionKey () {
  await performRefreshSessionKey(api.get_refresh_url);
}

async function callProtected () {
  await performCallProtected();
}

function decrypt (input) {
  return nuxtApp.$wasm.decrypt(user.contextHandle, input);
}

</script>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.shake-animation {
  animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both;
}
</style>
