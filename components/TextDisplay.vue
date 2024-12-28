<script setup lang="ts">
import { computed } from 'vue'
import { useClipboard } from '@vueuse/core'

const { text, isSupported, copy } = useClipboard()

const props = defineProps({
  content: {
    type: String,
    default: ''
  }
})

const formattedContent = computed(() => {
  try {
    return JSON.stringify(JSON.parse(props.content), null, 2)
  } catch {
    return props.content
  }
})

const handleCopy = () => {
  copy(formattedContent.value)
}
</script>

<template>
  <ClientOnly>
    <div class="relative">
      <pre
          class="max-h-[500px] overflow-auto rounded-lg bg-gray-900 p-4 font-mono text-sm text-white"
      ><code>{{ formattedContent }}</code></pre>
      <button
          @click="handleCopy"
          class="absolute right-2 top-2 rounded bg-gray-700 px-2 py-1 text-sm text-white hover:bg-gray-600"
      >
        Copy
      </button>
    </div>
    <template #fallback>
      <p>Loading...</p>
    </template>
  </ClientOnly>
</template>
