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
          <UButton @click="getNotes()"
                   class="w-full h-full text-white place-content-center
                        basis-1/5 bg-blue-700 hover:bg-blue-800
                        focus:ring-4 focus:outline-none focus:ring-blue-300
                        font-medium rounded-lg text-sm
                        px-5 py-2.5 text-center dark:bg-blue-600
                        dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Get Notes
          </UButton>
        </client-only>
      </CommonContainerDotted>

      <CommonContainerDotted containerClass="max-w-prose w-full" innerClass="flex flex-col gap-4">
        <client-only>
<!--          A list of notes.-->
          <text>
            Notes: {{notes.notesList}}
          </text>
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
const input_email = ref("");
const input_password = ref("");
const {performLogin} = useLoginAction();
const {performGetNotes} = useNotesAction();


function createContext () {
  const ctx = nuxtApp.$wasm.create_context(input_password.value);
  console.log("new = "+ ctx);
  user.setContextHandle(ctx);
}

function login() {
  user.setEmail(input_email.value);
  createContext();
  user.makeLoginPs(input_password.value);
  performLogin(api.signin_url);
}

function getNotes() {
  performGetNotes(api.get_notes_url);
}

</script>
