<template>
  <div class="flex flex-col  gap-6 mb-6 justify-center items-center ">
      <CommonContainerDotted containerClass="max-w-prose w-full" innerClass="flex flex-col gap-4">
        <label for="hash-input" class="block text-lg font-bold text-gray-900 dark:text-white">
          SHA3 Hash Function
        </label>
        <label for="enc-pass" class="block text-sm font-medium text-gray-900 dark:text-white">
          Plaintext
        </label>
        <ContainerColumnSplit45 class="h-9">
          <template #left>
            <CommonInputS
                id="hash-input"
                v-model="inputText"
                placeholder="Enter text"
                type="text"
                class="w-full h-full "
                :on-clear="() => inputText = ''"
            />
          </template>
          <template #right>
            <UButton @click="calculateHash"
                     class="w-full h-full text-white place-content-center
                            basis-1/5 bg-blue-700 hover:bg-blue-800
                            focus:ring-4 focus:outline-none focus:ring-blue-300
                            font-medium rounded-lg text-sm
                            px-5 py-2.5 text-center dark:bg-blue-600
                            dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Calculate
            </UButton>
          </template>
        </ContainerColumnSplit45>

        <label class="block text-sm font-medium text-gray-900 dark:text-white">
          Generated Hash
        </label>
        <ClipBoard :content="hash"/>
      </CommonContainerDotted>


    <CommonContainerDotted containerClass="max-w-prose w-full" innerClass="flex flex-col gap-4">
      <label for="enc-pass" class="block text-lg font-bold text-gray-900 dark:text-white">
        Encryption
      </label>
      <label for="enc-pass" class="block text-sm font-medium text-gray-900 dark:text-white">
        Encryption Password
      </label>
      <CommonInputS id="enc-pass" v-model="encPass" placeholder="1234"
                    type="text" class="h-9"
                    :on-clear="() => encPass = ''"
      />
      <label for="enc-plain" class="block text-sm font-medium text-gray-900 dark:text-white">
        Plaintext
      </label>
      <ContainerColumnSplit45 class="h-9">
        <template #left>
          <CommonInputS id="enc-plain" v-model="encPlain" placeholder="Enter text"
                        type="text" class="w-full h-full"
                        :on-clear="() => encPlain = ''"
          />
        </template>
        <template #right>
          <UButton @click="encrypt" class="w-full h-full text-white place-content-center
        bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300
        font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600
        dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Encrypt
          </UButton>
        </template>
      </ContainerColumnSplit45>
      <label class="block text-sm font-medium text-gray-900 dark:text-white">
        Encrypted Text
      </label>
      <ClipBoard :content="encrypted" />
    </CommonContainerDotted>

    <CommonContainerDotted containerClass="max-w-prose w-full" innerClass="flex flex-col gap-4">
      <label for="dec-pass" class="block text-lg font-bold text-gray-900 dark:text-white">
        Decryption
      </label>
      <label for="dec-pass" class="block text-sm font-medium text-gray-900 dark:text-white">
        Decryption Password
      </label>
      <CommonInputS id="dec-pass" v-model="decPass" placeholder="1234"
                    type="text" class="h-9"
                    :on-clear="() => decPass = ''"
      />
      <label for="dec-cipher" class="block text-sm font-medium text-gray-900 dark:text-white">
        Ciphertext
      </label>
      <ContainerColumnSplit45 class="h-9">
        <template #left>
          <CommonInputS id="dec-cipher" v-model="decCipher" placeholder="Enter text"
                        type="text" class="w-full h-full"
                        :on-clear="() => decCipher = ''"
          />
        </template>
        <template #right>
          <UButton @click="decrypt" class="w-full h-full text-white place-content-center
        bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300
        font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600
        dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Decrypt
          </UButton>
        </template>
      </ContainerColumnSplit45>
      <label for="decrypted-text" class="block text-sm font-medium text-gray-900 dark:text-white">
        Decrypted Text
      </label>
      <ClipBoard id="decrypted-text" :content="decrypted" />
    </CommonContainerDotted>

    <CommonContainerDotted containerClass="max-w-prose w-full" innerClass="flex flex-col gap-4">
      <label class="block text-lg font-bold text-gray-900 dark:text-white">
        WASM Runtime Secure Crypto Context
      </label>
      <ContainerColumnSplit45 class="h-9">
        <template #left>
          <CommonInputS id="context-pass" v-model="contextPass" placeholder="1234"
                        type="text" class="w-full h-full"
                        :on-clear="() => contextPass = ''"
          />
        </template>
        <template #right>
          <UButton @click="createContext" class="w-full h-full text-white place-content-center
        bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300
        font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600
        dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Create
          </UButton>
        </template>
      </ContainerColumnSplit45>

      <p>
        Context Handle: {{ userStore.contextHandle }}
      </p>

      <label for="context-plain" class="block text-sm font-medium text-gray-900 dark:text-white">
        Encrypt
      </label>

      <ContainerColumnSplit45 class="h-9">
        <template #left>
          <CommonInputS id="context-plain" v-model="contextPlain" placeholder="Enter text"
                        type="text" class="w-full h-full"
                        :on-clear="() => contextPlain = ''"
          />
        </template>
        <template #right>
          <UButton @click="contextEncrypt" class="w-full h-full text-white place-content-center
        bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300
        font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600
        dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Encrypt
          </UButton>
        </template>
      </ContainerColumnSplit45>

      <ClipBoard :rows="2" :content="contextEncrypted" />

      <label for="context-decrypt" class="block mt-5 text-sm font-medium text-gray-900 dark:text-white">
        Decrypt
      </label>

      <ContainerColumnSplit45 class="h-9">
        <template #left>
          <CommonInputS id="context-decrypt" v-model="contextCipher" placeholder="Enter text"
                        type="text" class="w-full h-full"
                        :on-clear="() => contextCipher = ''"
          />
        </template>
        <template #right>
          <UButton @click="contextDecrypt" class="w-full h-full text-white place-content-center
        bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300
        font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600
        dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Decrypt
          </UButton>
        </template>
      </ContainerColumnSplit45>

      <ClipBoard :rows="2" :content="contextDecrypted" />
    </CommonContainerDotted>
    <CommonContainerDotted containerClass="max-w-prose w-full" innerClass="flex flex-col gap-4">
      <label class="block text-lg font-bold text-gray-900 dark:text-white">
        Fingerprinting
      </label>
      <UButton @click="generateSalt" class="w-full h-full text-white place-content-center
        bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300
        font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600
        dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Generate Salt
      </UButton>
      <label class="block text-sm font-medium text-gray-900 dark:text-white">
        Generated Salt
      </label>
      <ClipBoard :content="generatedSalt" />
    </CommonContainerDotted>
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
const contextCipher = ref('c5c735e80f1d1ea013ef7aa1d0e98e81827b32ccfc847cbdc9106ddd07f3c21379f04506f3017eeed64dd52dbe25df72031e40c176e69915d068b898984fde816013c67b68f1c9cb1341d05d1cd043');
const contextEncrypted = ref('');
const contextDecrypted = ref('');
function createContext () {
  const ctx = nuxtApp.$wasm.create_context(contextPass.value);
  console.log("new = "+ ctx);
  userStore.setContextHandle(ctx);
}
function contextEncrypt() {
  contextEncrypted.value = nuxtApp.$wasm.encrypt(userStore.contextHandle, contextPlain.value);
}
function contextDecrypt() {
  contextDecrypted.value = nuxtApp.$wasm.decrypt(userStore.contextHandle, contextCipher.value);
}

const generatedSalt = ref('');
const {salt} = useSecurity();
function generateSalt() {
  generatedSalt.value = salt();
}


</script>
