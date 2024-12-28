<script setup lang="ts">
import { computed } from 'vue'
import { useClipboard, usePermission } from '@vueuse/core'
const { text, isSupported, copy } = useClipboard()

const props = defineProps({
  content: {
    type: String,
    default: ''
  },
  rows: {
    type: Number,
    default: 2
  },
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
      <div v-if="isSupported" class="flex flex-row gap-2" >
        <UTextarea
            :value="input"
            :rows="rows"
            cols="50"
            class="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            readonly
        ></UTextarea>
        <UButton
            @click="copyContent"
            :class="{
              'bg-green-500  text-white': isCopied,
              'bg-blue-500 hover:bg-blue-800 text-white': !isCopied,
            }"
            class="px-4 py-2 rounded-lg basis-1/5 place-content-center"
        >
          {{ isCopied ? 'Copied!' : 'Copy' }}
        </UButton>
      </div>
      <p v-else  class="flex flex-row gap-2" >
        <UTextarea
            :value="input"
            :rows="rows"
            cols="50"
            class="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            readonly
        ></UTextarea>
        <UTooltip text="Your Browser appears to not support Clipboard API." :popper="{ arrow: true }">
          <UButton
              @click="copyContent"
              :class="{
              'bg-green-500  text-white': isCopied,
              'bg-blue-500 hover:bg-blue-800 text-white': !isCopied,
            }"
              class="px-4 py-2 rounded-lg basis-1/5 place-content-center"
              disabled>
            {{ isCopied ? 'Copied!' : 'Copy' }}

          </UButton>
        </UTooltip>
      </p>

    <template #fallback>
      <p>Loading...</p>
    </template>
  </ClientOnly>
</template>
