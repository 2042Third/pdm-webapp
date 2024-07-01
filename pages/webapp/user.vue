<template>
    <div class="flex flex-col  gap-6 mb-6 justify-center items-center ">
      <CommonContainerDotted containerClass="max-w-prose w-full" innerClass="flex flex-col gap-4">
        <CommonInputS id="user-email" v-model="input_email"
                      type="text" class="w-full h-full"
                      :on-clear="() => input_email = ''"
                      placeholder="Email"
        />

        <CommonInputS id="user-ps" v-model="input_password"
                      type="password" class="w-full h-full"
                      :on-clear="() => input_password = ''"
                      placeholder="Password"
        />

        <UButton @click="login()"
                 class="w-full h-full text-white place-content-center
                        basis-1/5 bg-blue-700 hover:bg-blue-800
                        focus:ring-4 focus:outline-none focus:ring-blue-300
                        font-medium rounded-lg text-sm
                        px-5 py-2.5 text-center dark:bg-blue-600
                        dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Login
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
            Session Key Expiration: {{user.sessionKeyExpiration}}
          </text>

        </client-only>
      </CommonContainerDotted>
      <CommonContainerDotted containerClass="max-w-prose w-full" innerClass="flex flex-col gap-4">
        <client-only>
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
        </client-only>
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
import { useNotesStore } from '~/stores/notesStore'

const nuxtApp = useNuxtApp();
const user = useUserStore();
const api = useApiStore();
const notes = useNotesStore();
const userConfig = useUserConfigStore();
const {performLogin, performLogout} = useAuthAction();
const {performGetNotes} = useNotesAction();



function createContext () {
  const ctx = nuxtApp.$wasm.create_context(input_password.value);
  console.log("new = "+ ctx);
  user.setContextHandle(ctx);
}

const input_email = ref("");
const input_password = ref("");
async function login() {
  user.setEmail(input_email.value);
  createContext();
  user.makeLoginPs(input_password.value);
  if (await performLogin(api.signin_url)) {
    if (userConfig.storesPasswordLocally) {
      await user.storeLocalPassword(input_password.value);
    }
  }
}

async function logout() {
  await user.clearAll();
  await performLogout(api.signout_url);
}

function getNotes() {
  performGetNotes(api.get_notes_url);
}

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};

const userDataStatus = ref(false);
const {performGetUserData} = useAuthAction();
async function getUserData(){
  userDataStatus.value = await performGetUserData(api.get_user_url);
  console.log("[User page] UserData" + user.userData);
}

function decrypt (input) {
  return nuxtApp.$wasm.decrypt(user.contextHandle, input);
}

</script>
