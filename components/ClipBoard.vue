<script setup lang="ts">
import { computed } from 'vue'
import { useClipboard, usePermission } from '@vueuse/core'
const { text, isSupported, copy } = useClipboard()

const props = defineProps({
  content: {
    type: String,
    default: ''
  }
})

const input = computed(() => props.content.trim())

const isCopied = ref(false);

const copyContent = () => {
  copy(input.value);
  isCopied.value = true;
  setTimeout(() => {
    isCopied.value = false;
  }, 2000);
};

</script>


<template>
  <ClientOnly>
    <template #default>
      <div v-if="isSupported">
        <textarea :value="input" rows="5" cols="50"
                  class=" mb-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  readonly></textarea>
        <button
            @click="copyContent"
            :class="{
              'bg-green-500 text-white': isCopied,
              'bg-blue-500 text-white': !isCopied,
            }"
            class="px-4 py-2 rounded-lg "
        >
          {{ isCopied ? 'Copied!' : 'Copy' }}
        </button>
      </div>
      <p v-else>Your browser does not support Clipboard API</p>
    </template>

    <template #fallback>
      <p>Loading...</p>
    </template>
  </ClientOnly>
</template>
