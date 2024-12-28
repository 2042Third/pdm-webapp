<script setup lang="ts">
// BaseToggleSection.vue
import { vAutoAnimate } from '@formkit/auto-animate'

const props = defineProps<{
  title?: string
  defaultOpen?: boolean
}>()

const isOpen = ref(props.defaultOpen ?? false)
</script>

<template>
  <div class="space-y-2">
    <!-- Header -->
    <button
        @click="isOpen = !isOpen"
        class="flex w-full items-center justify-between rounded-lg bg-gray-100 p-3
             hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        :aria-expanded="isOpen"
    >
      <span>{{ title }}</span>
      <UIcon
          name="i-heroicons-chevron-right-20-solid"
          class="transform transition-transform duration-200"
          :class="isOpen ? 'rotate-90' : ''"
      />
    </button>

    <!-- Content -->
    <div v-auto-animate>
      <div v-if="isOpen">
        <slot />
      </div>
    </div>
  </div>
</template>
