// components/DebugPopup.vue
<script setup>
import { ref } from 'vue'
import { useNotesStore } from '~/stores/notesStore'

const [parent] = useAutoAnimate();

const showDebug = ref(false)

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
  console.log(`[DebugPopup] Session Key Expiration: ${state.sessionKeyExpiration}`);
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
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  position: {
    type: String,
    default: 'bottom-right',
    validator: (value) => ['top-left', 'top-right', 'bottom-left', 'bottom-right'].includes(value)
  }
})

const emit = defineEmits(['close'])

// State for demo inputs
const debugText = ref('')
const debugNumber = ref(0)
const debugStatus = ref('idle')

// Example function to update status
const updateStatus = () => {
  debugStatus.value = 'processing'
  setTimeout(() => {
    debugStatus.value = 'completed'
  }, 1000)
}

// Close on escape key
onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && props.isOpen) {
      emit('close')
    }
  })
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen"
           :class="[
             'fixed p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border ' +
              'border-gray-200 dark:border-gray-700 z-50 max-w-prose w-full max-h-[60vh] flex flex-col',
             {
               'top-4 left-4': position === 'top-left',
               'top-4 right-4': position === 'top-right',
               'bottom-4 left-4': position === 'bottom-left',
               'bottom-4 right-4': position === 'bottom-right'
             }
           ]">
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold dark:text-white">Debug Panel</h3>
          <button @click="$emit('close')"
                  class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <span class="sr-only">Close</span>
            ×
          </button>
        </div>

        <!-- Debug Content -->
        <div class="space-y-4 overflow-y-auto flex-1">
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
              <text>
                Refresh Key : {{user.refreshKey}}
              </text>
              <text>
                Refresh Key Expiration: {{unixToHumanReadableTime(user.refreshKeyExpiration)}}
              </text>
              <text>
                Refresh Key Status: {{user.hasRefreshKey}}
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
            <UButton
                @click="getValidationRefreshKey()"
                class="w-full h-full text-white place-content-center
                 basis-1/5 bg-blue-700 hover:bg-blue-800
                 focus:ring-4 focus:outline-none focus:ring-blue-300
                 font-medium rounded-lg text-sm
                 px-5 py-2.5 text-center dark:bg-blue-600
                 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Validate Refresh Key
            </UButton>


            <UButton
                @click="refreshSessionKey()"
                class="w-full h-full text-white place-content-center
                 basis-1/5 bg-blue-700 hover:bg-blue-800
                 focus:ring-4 focus:outline-none focus:ring-blue-300
                 font-medium rounded-lg text-sm
                 px-5 py-2.5 text-center dark:bg-blue-600
                 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Refresh Session Key
            </UButton>

            <UButton
                @click="callProtected()"
                class="w-full h-full text-white place-content-center
                 basis-1/5 bg-blue-700 hover:bg-blue-800
                 focus:ring-4 focus:outline-none focus:ring-blue-300
                 font-medium rounded-lg text-sm
                 px-5 py-2.5 text-center dark:bg-blue-600
                 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Call Protected
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

              <div ref="parent" v-if="notes.notesList.length" class="space-y-4">
                <div  v-for="note in notes.notesList" :key="note.noteid" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
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
          <!-- Text Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Debug Text</label>
            <input v-model="debugText"
                   type="text"
                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>

          <!-- Number Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Debug Number</label>
            <input v-model="debugNumber"
                   type="number"
                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>

          <!-- Status Display -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
            <div class="mt-1 flex items-center space-x-2">
              <span :class="['px-2 py-1 text-sm rounded-full',{
                'bg-gray-100 text-gray-800': debugStatus === 'idle',
                'bg-blue-100 text-blue-800': debugStatus === 'processing',
                'bg-green-100 text-green-800': debugStatus === 'completed'
              }]">
                {{ debugStatus }}
              </span>
              <button @click="updateStatus"
                      class="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Update Status
              </button>
            </div>
          </div>

          <!-- Debug Output -->
          <div class="mt-4 p-2 bg-gray-100 dark:bg-gray-700 rounded">
            <pre class="text-xs">
              {{ {
              text: debugText,
              number: debugNumber,
              status: debugStatus
            } }}
            </pre>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
