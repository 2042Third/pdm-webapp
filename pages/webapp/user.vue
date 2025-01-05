<template>
  <div class="flex flex-col gap-6 mb-6 justify-center items-center">
    <CommonContainerDotted containerClass="max-w-prose w-full" innerClass="flex flex-col gap-4">
      <client-only>
        <!-- Rest of login inputs remain the same -->
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

        <!-- Error message -->
        <div
            v-if="showError"
            class="text-red-500 text-sm mb-2 transition-all duration-300 ease-in-out"
            :class="{ 'shake-animation': showError }"
        >
          Incorrect email or password. Please try again.
        </div>

        <!-- Login and signup buttons -->
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
            v-if="!user.isLoggedIn"
            @click="openSignupModal()"
            :loading="isLoading"
            :disabled="isLoading"
            class="w-full h-full text-white place-content-center
                   basis-1/5 bg-blue-700 hover:bg-blue-800
                   focus:ring-4 focus:outline-none focus:ring-blue-300
                   font-medium rounded-lg text-sm
                   px-5 py-2.5 text-center dark:bg-blue-600
                   dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Sign Up
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

    <client-only>
      <ModalSignin v-model="isSignUpModalOpen"
                   title="Signup"
                   :hideCloseButton="false"
                   :closeOnBackdrop="false"
                   :hideHeader="false"
      >
        <div
            v-if="shouldShowSignupVerify"
            class="flex flex-col gap-4">
          <CommonInputS
              id="user-verification-code"
              v-model="input_verification"
              type="text"
              class="w-full h-full"
              :class="{ 'border-red-500': showError }"
              :on-enter="signupVerify"
              placeholder="xxx-xxx"
          />
          <UButton
              @click="signupVerify()"
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
            {{ isLoading ? '...' : 'Submit' }}
          </UButton>
        </div>

        <div v-if="!shouldShowSignupVerify" class="flex flex-col gap-4">
          <CommonContainerDotted containerClass="max-w-prose w-full" innerClass="flex flex-col gap-4">
            <CommonInputS
                id="user-email-signup"
                v-model="input_email_signup"
                type="text"
                class="w-full h-full"
                :class="{ 'border-red-500': showError }"
                :on-enter="signup"
                placeholder="Email"
            />
            <CommonInputS
                id="user-ps-signup"
                v-model="input_password_signup"
                type="password"
                class="w-full h-full"
                :class="{ 'border-red-500': showError }"
                :on-enter="signup"
                placeholder="Password"
            />
            <!-- Fixed Turnstile container -->
            <div class="flex justify-center">
              <div id="turnstile-widget" ref="turnstileContainer" class="mt-4"></div>
            </div>
            <div v-if="turnstileError" class="text-red-500 text-sm">
              {{ turnstileError }}
            </div>
          </CommonContainerDotted>
          <UButton
              v-if="!user.isLoggedIn"
              @click="signup()"
              :loading="isLoading"
              :disabled="isLoading || !turnstileToken"
              class="w-full h-full text-white place-content-center
                     basis-1/5 bg-blue-700 hover:bg-blue-800
                     focus:ring-4 focus:outline-none focus:ring-blue-300
                     font-medium rounded-lg text-sm
                     px-5 py-2.5 text-center dark:bg-blue-600
                     dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              :class="{ 'shake-animation': showError }"
          >
            {{ isLoading ? 'Signing up...' : 'Sign Up' }}
          </UButton>
        </div>
      </ModalSignin>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { useNotesStore } from '~/stores/notesStore'

const [parent] = useAutoAnimate()
const nuxtApp = useNuxtApp()
const user = useUserStore()
const api = useApiStore()
const notes = useNotesStore()
const userConfig = useUserConfigStore()
const config = useRuntimeConfig()
const { performLogin, performLoginWithRefresh, performValidateRefreshKey,
  performLogout, performValidation, performRefreshSessionKey,
  performSignup, performSignupVerify,
  performCallProtected } = useAuthAction()
const { performGetNotes } = useNotesAction()
const { unixToHumanReadableTime } = useUtil()

// Refs for form inputs and state
const turnstileContainer = ref(null)
const turnstileWidget = ref(null)
const turnstileToken = ref('')
const turnstileError = ref('')
const input_email = ref("")
const input_password = ref("")
const input_email_signup = ref("")
const input_password_signup = ref("")
const input_verification = ref("")
const shouldShowSignupVerify = ref(false)
const isLoading = ref(false)
const showError = ref(false)
const isSignUpModalOpen = ref(false)

// Define initialization function
const initTurnstile = () => {
  console.log('*** Debug: initTurnstile called ***')
  console.log('Container ref:', turnstileContainer.value)
  console.log('Window turnstile:', Boolean(window?.turnstile))
  console.log('Site key:', config.public.turnstileSiteKey)
  console.log('Initializing Turnstile...')
  try {
    if (!turnstileContainer.value) {
      console.error('Turnstile container not found')
      turnstileError.value = 'Widget container not found'
      return
    }

    if (!window?.turnstile) {
      console.error('Turnstile not loaded')
      turnstileError.value = 'Verification widget failed to load'
      return
    }

    if (!config.public.turnstileSiteKey) {
      console.error('Turnstile site key not found')
      turnstileError.value = 'Missing site configuration'
      return
    }

    console.log('Rendering Turnstile with site key:', config.public.turnstileSiteKey)

    // Clear any existing widgets
    if (turnstileWidget.value) {
      window.turnstile.remove(turnstileWidget.value)
    }

    // Render new widget
    turnstileWidget.value = window.turnstile.render(turnstileContainer.value, {
      sitekey: config.public.turnstileSiteKey,
      callback: (token) => {
        console.log('Turnstile callback received')
        turnstileToken.value = token
        turnstileError.value = ''
      },
      'error-callback': () => {
        console.error('Turnstile verification failed')
        turnstileError.value = 'Verification failed. Please try again.'
        turnstileToken.value = ''
      },
      'expired-callback': () => {
        console.log('Turnstile token expired')
        turnstileToken.value = ''
        turnstileError.value = 'Verification expired. Please try again.'
      }
    })

    console.log('Turnstile widget rendered:', turnstileWidget.value)
  } catch (error) {
    console.error('Error initializing Turnstile:', error)
    turnstileError.value = 'Failed to initialize verification widget'
  }
}

// Watch for modal changes
watch(isSignUpModalOpen, (newValue) => {
  console.log('Modal state changed:', newValue)
  if (newValue) {
    // Modal opened
    nextTick(() => {
      console.log('Modal opened, checking turnstile state')
      if (window?.turnstile && turnstileContainer.value) {
        console.log('Initializing turnstile from watch')
        initTurnstile()
      }
    })
  } else {
    // Modal closed
    if (turnstileWidget.value && window?.turnstile) {
      console.log('Resetting turnstile')
      window.turnstile.reset(turnstileWidget.value)
      turnstileToken.value = ''
    }
  }
})

// Define Turnstile load callback
if (typeof window !== 'undefined') {
  window.onTurnstileLoad = () => {
    console.log('Turnstile script loaded')
    if (turnstileContainer.value) {
      initTurnstile()
    }
  }
}

// Component lifecycle
onMounted(() => {
  console.log('Component mounted')
  // Check if we're already on the signup modal
  if (isSignUpModalOpen.value) {
    console.log('Modal already open on mount')
    nextTick(() => {
      if (window?.turnstile && turnstileContainer.value) {
        console.log('Initializing turnstile on mount')
        initTurnstile()
      }
    })
  }
})

// Load Turnstile script
useHead({
  script: [
    {
      src: 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad',
      async: true,
      defer: true
    }
  ]
})

user.$subscribe((mutation, state) => {
  input_email.value = state.email;
})

// Callback when Turnstile is completed
const onTurnstileSuccess = (token) => {
  turnstileToken.value = token
}

function openSignupModal() {
  isSignUpModalOpen.value = true
  // Wait for modal to open and container to be available
  nextTick(async () => {
    console.log('Modal opened, waiting for container...')
    // Give the DOM time to update
    await new Promise(resolve => setTimeout(resolve, 100))

    if (!turnstileContainer.value) {
      console.log('Container not found after initial delay')
      // Try again after a longer delay
      setTimeout(() => {
        console.log('Retrying turnstile initialization...')
        if (window?.turnstile && turnstileContainer.value) {
          initTurnstile()
        } else {
          console.log('Still no container or turnstile:', {
            container: Boolean(turnstileContainer.value),
            turnstile: Boolean(window?.turnstile)
          })
        }
      }, 500)
    } else {
      console.log('Container found immediately')
      initTurnstile()
    }
  })
}

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

// Make callback globally available
if (import.meta.client) {
  window.onTurnstileSuccess = onTurnstileSuccess
}

async function signup() {
  isLoading.value = true;
  showError.value = false;

  if (!turnstileToken.value) {
    showError.value = true;
    isLoading.value = false;
    return;
  }

  try {
    user.setEmail(input_email_signup.value);
    user.makeLoginPs(input_password_signup.value);

    // Include turnstile token in your signup request
    const out = await performSignup(api.signup_url, turnstileToken.value);

    if (out) {
      shouldShowSignupVerify.value = true;
    } else {
      showError.value = true;
      setTimeout(() => {
        showError.value = false;
      }, 3000);
    }
  } catch (error) {
    console.error('Signup failed:', error);
    showError.value = true;
    setTimeout(() => {
      showError.value = false;
    }, 3000);
  } finally {
    isLoading.value = false;
  }
}

async function signupVerify() {

  isLoading.value = true;
  try {
    const out = await performSignupVerify(api.signup_verify_url, input_verification.value);
    if (out) {
      // Complete the signup process, close the window
      console.log("Verification successful");
      setTimeout(() => {
        isSignUpModalOpen.value = false;
      }, 1000);
    } else { // show the error message
      showError.value = true;
      setTimeout(() => {
        showError.value = false;
      }, 3000); // Hide error message after 3 seconds
    }
  }
  catch (error) {
    console.error('Signup failed:', error);
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
