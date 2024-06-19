<template>
  <div class="grid gap-6 mb-6 md:grid-cols-2">
    <div class="mb-6">
      <label for="hash-input" class="block mb-5 text-lg font-bold text-gray-900 dark:text-white"
      > SHA3 Hash Function </label>
      <label for="enc-pass" class="block mb-5 text-sm font-medium text-gray-900 dark:text-white"
      > Plaintext </label>

      <CommonInputS
          id="hash-input"
          v-model="inputText"
          placeholder="Enter text"
          type="text"
          class=" mb-5"
          :on-clear="() => inputText = ''"
          />

      <button @click="calculateHash" class="text-white  mb-5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >Calculate Hash</button>

      <label class="block mb-5 text-sm font-medium text-gray-900 dark:text-white"
      >Generated Hash</label>
      <ClipBoard :content="hash" />

    </div>

    <div class="mb-6">
      <label for="enc-pass" class="block mb-5 text-lg font-bold text-gray-900 dark:text-white"
      > Encryption </label>

      <label for="enc-pass" class="block mb-5 text-sm font-medium text-gray-900 dark:text-white"
      >Encryption Password</label>
      <CommonInputS id="enc-pass" v-model="encPass" placeholder="1234"
                    type="text" class=" mb-5"
                    :on-clear="() => encPass = ''"
      />

      <label for="enc-plain" class="block mb-5 text-sm font-medium text-gray-900 dark:text-white"
      >Plaintext</label>
      <CommonInputS id="enc-plain" v-model="encPlain" placeholder="Enter text"
                    type="text" class=" mb-5 "
                    :on-clear="() => encPlain = ''"
      />
      <button @click="encrypt" class="text-white  mb-5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >Encrypt</button>

      <label class="block mb-5 text-sm font-medium text-gray-900 dark:text-white"
      >Encrypted Text</label>
      <ClipBoard :content="encrypted" />

    </div>

    <div class="mb-6">
      <label for="dec-pass" class="block mb-5 text-lg font-bold text-gray-900 dark:text-white"
      > Decryption </label>
      <label for="dec-pass" class="block mb-5 text-sm font-medium text-gray-900 dark:text-white"
      >Decryption Password</label>
      <CommonInputS id="dec-pass" v-model="decPass" placeholder="1234"
                    type="text" class=" mb-5"
                    :on-clear="() => decPass = ''"
      />

      <label for="dec-cipher" class="block mb-5 text-sm font-medium text-gray-900 dark:text-white"
      >Ciphertext</label>
      <CommonInputS id="dec-cipher" v-model="decCipher" placeholder="Enter text"
                    type="text" class=" mb-5"
                    :on-clear="() => decCipher = ''"
      />
      <button @click="decrypt" class="text-white  mb-5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >Decrypt</button>

      <label class="block mb-5 text-sm font-medium text-gray-900 dark:text-white"
      >Decrypted Text</label>
      <ClipBoard :content="decrypted" />

    </div>

    <div class="mb-6">
      <label class="block mb-5 text-lg font-bold text-gray-900 dark:text-white"
      > WASM Runtime Secure Crypto Context </label>
      <CommonInputS id="context-pass" v-model="contextPass" placeholder="1234"
                    type="text" class=" mb-5"
                    :on-clear="() => contextPass = ''"
      />
      <button @click="createContext" class="text-white  mb-5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >Create</button>

      <label class="block mb-5 text-sm font-medium text-gray-900 dark:text-white"
      >Generated Key</label>
      <p>
        Context Handle: {{userStore.contextHandle}}
      </p>
      <label for="context-plain" class="block mb-5 text-sm font-medium text-gray-900 dark:text-white"
      >Plaintext</label>
      <CommonInputS id="context-plain" v-model="contextPlain" placeholder="Enter text"
                    type="text" class=" mb-5 "
                    :on-clear="() => contextPlain = ''"
      />
      <button @click="contextEncrypt" class="text-white  mb-5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >Encrypt</button>

      <ClipBoard :content="contextEncrypted" />

    </div>

  </div>
</template>

<script setup lang="ts">

const nuxtApp = useNuxtApp();

const inputText = ref('');
const hash = ref('');
function calculateHash() {
  hash.value = nuxtApp.$wasm.get_hash(inputText.value);
}

const encPass = ref('1234');
const encPlain = ref('Some text to encrypt');
const encrypted = ref('');
function encrypt() {
  encrypted.value = nuxtApp.$wasm.loader_check(encPass.value,encPlain.value);
}

const decPass = ref('1234');
const decCipher = ref('c5c735e80f1d1ea013ef7aa1d0e98e81827b32ccfc847cbdc9106ddd07f3c21379f04506f3017eeed64dd52dbe25df72031e40c176e69915d068b898984fde816013c67b68f1c9cb1341d05d1cd043');
const decrypted = ref('');
function decrypt() {
  decrypted.value = nuxtApp.$wasm.loader_out(decPass.value,decCipher.value);
}

const generatedKeyPDM = ref('');
function generateKeyPDM() {
  generatedKeyPDM.value = nuxtApp.$wasm.gen_sec();
}
function haxStrToBinarySize(hexStr: string) {
  return hexStr.length * 4;
}

const userStore = useUserStore();
const contextPass = ref('1234');
const contextPlain = ref('Some text to encrypt');
const contextEncrypted = ref('');
function createContext () {
  const ctx = nuxtApp.$wasm.create_context(contextPass.value);
  console.log("new = "+ ctx);
  userStore.setContextHandle(ctx);
}
function contextEncrypt() {
  contextEncrypted.value = nuxtApp.$wasm.encrypt(userStore.contextHandle, contextPlain.value);
}


</script>
