<template>
    <div class="flex flex-col  gap-6 mb-6 justify-center items-center ">
      <CommonContainerDotted containerClass="max-w-prose w-full" innerClass="flex flex-col gap-4">
        <CommonInputS
            id="user-email"
            v-model="input_email"
            type="text"
            class="w-full h-full"
            :class="{ 'border-red-500': showError }"
            :on-clear="() => input_email = ''"
            :on-enter="login"
            placeholder="Email"
        />

        <CommonInputS
            id="user-ps"
            v-model="input_password"
            type="password"
            class="w-full h-full"
            :class="{ 'border-red-500': showError }"
            :on-clear="() => input_password = ''"
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

        <UButton v-if="user.isLoggedIn" @click="logout()"
                 class="w-full h-full text-white place-content-center
                        basis-1/5 bg-blue-700 hover:bg-blue-800
                        focus:ring-4 focus:outline-none focus:ring-blue-300
                        font-medium rounded-lg text-sm
                        px-5 py-2.5 text-center dark:bg-blue-600
                        dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Logout
        </UButton>

      </CommonContainerDotted>
      <CommonContainerDotted containerClass="max-w-prose w-full" innerClass="flex flex-col gap-4">
        <ClipBoard :content="user.loginPs"/>
        <client-only>
        <text>
          Login Status: {{user.isLoggedIn}}
        </text>
          <text>
            Session Key: {{user.sessionKey}}
          </text>
          <text>
            Session Key Expiration: {{unixToHumanReadableTime(user.sessionKeyExpiration)}}
          </text>
          <text>
            Session Key Validation Status: {{user.validationStatus}}
          </text>

        </client-only>
      </CommonContainerDotted>
      <CommonContainerDotted containerClass="max-w-prose w-full" innerClass="flex flex-col gap-4">
          <UButton
              @click="getUserData()"
              class="w-full h-full text-white place-content-center
                 basis-1/5 bg-blue-700 hover:bg-blue-800
                 focus:ring-4 focus:outline-none focus:ring-blue-300
                 font-medium rounded-lg text-sm
                 px-5 py-2.5 text-center dark:bg-blue-600
                 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Get User Data
          </UButton>

        <UButton
            @click="getUserDataPOST()"
            class="w-full h-full text-white place-content-center
                 basis-1/5 bg-blue-700 hover:bg-blue-800
                 focus:ring-4 focus:outline-none focus:ring-blue-300
                 font-medium rounded-lg text-sm
                 px-5 py-2.5 text-center dark:bg-blue-600
                 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Get User Data POST
        </UButton>
        <UButton
            @click="getValidation()"
            class="w-full h-full text-white place-content-center
                 basis-1/5 bg-blue-700 hover:bg-blue-800
                 focus:ring-4 focus:outline-none focus:ring-blue-300
                 font-medium rounded-lg text-sm
                 px-5 py-2.5 text-center dark:bg-blue-600
                 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Validate Session Key
        </UButton>
      </CommonContainerDotted>
      <CommonContainerDotted containerClass="max-w-prose w-full" innerClass="flex flex-col gap-4">
        <client-only>
          <UButton
              @click="getNotes()"
              class="w-full h-full text-white place-content-center
                 basis-1/5 bg-blue-700 hover:bg-blue-800
                 focus:ring-4 focus:outline-none focus:ring-blue-300
                 font-medium rounded-lg text-sm
                 px-5 py-2.5 text-center dark:bg-blue-600
                 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Get Notes
          </UButton>

          <div v-if="notes.notesList.length" class="space-y-4">
            <div v-for="note in notes.notesList" :key="note.noteid" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <div class="flex justify-between items-center mb-2">
                <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Note ID: {{ note.noteid }}</h2>
                <span class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(note.time) }}</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300">{{ note.heading }}</p>
            </div>
          </div>
          <p v-else class="text-center text-gray-500 dark:text-gray-400">No notes available. Click 'Get Notes' to fetch your notes.</p>
        </client-only>
      </CommonContainerDotted>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useNotesStore } from '~/stores/notesStore'

const nuxtApp = useNuxtApp();
const user = useUserStore();
const api = useApiStore();
const notes = useNotesStore();
const userConfig = useUserConfigStore();
const { performLogin, performLogout, performValidation } = useAuthAction();
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
    if (await performLogin(api.signin_url)) {
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
