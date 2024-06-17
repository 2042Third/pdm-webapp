<template>
  <div class="grid gap-6 mb-6 md:grid-cols-2">
    <div class="mb-6">
      <label for="default-input" class="block mb-5 text-sm font-medium text-gray-900 dark:text-white">Plaintext input</label>
      <input v-model="inputText" placeholder="Enter text"
             type="text" class=" mb-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
      <button @click="calculateHash" class="text-white  mb-5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >Calculate Hash</button>


      <p
          class="text-sm font-medium text-gray-900 dark:text-white"
      >Hash: {{ hash }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const inputText = ref('');
const hash = ref('');
const nuxtApp = useNuxtApp();

function calculateHash() {
  hash.value = nuxtApp.$wasm.get_hash(inputText.value);
}
</script>
