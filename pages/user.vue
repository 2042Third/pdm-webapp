<template>
  <div>
    <input v-model="inputText" placeholder="Enter text" />
    <button @click="calculateHash">Calculate Hash</button>
    <p>Hash: {{ hash }}</p>
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
