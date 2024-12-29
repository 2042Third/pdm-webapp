<script setup lang="ts">
import { vAutoAnimate } from '@formkit/auto-animate'

// Define props with explicit types for better performance
interface Props {
  title?: string
  defaultOpen?: boolean
  /** Unique identifier for performance optimization */
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  defaultOpen: false,
  title: '',
  id: () => `toggle-${Math.random().toString(36).slice(2)}`
})

// Memoize the title for better performance
const displayTitle = computed(() => props.title)

const isOpen = ref(props.defaultOpen ?? false)
const hasBeenOpened = ref(isOpen.value)
const contentRef = ref(null)

// Track first open with a slight delay for the initial animation
async function handleToggle() {
  if (!isOpen.value && !hasBeenOpened.value) {
    // First time opening
    hasBeenOpened.value = true
    // Wait for next tick for v-if to complete
    await nextTick()
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      isOpen.value = true
    }, 50)
  } else {
    // Subsequent toggles
    isOpen.value = !isOpen.value
  }
}

onMounted(() => {
  watch(contentRef, (el) => {
    if (el) {
      // @ts-ignore - formkit types might be missing
      vAutoAnimate.directive.mounted(el)
    }
  })
})
</script>

<template>
  <div class="space-y-2">
    <!-- Header -->
    <button
        @click="handleToggle"
        class="flex w-full items-center justify-between rounded-lg bg-gray-100 p-3
             hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        :aria-expanded="isOpen"
    >
      <span>{{ displayTitle }}</span>
      <UIcon
          name="i-heroicons-chevron-right-20-solid"
          class="transform transition-transform duration-200"
          :class="isOpen ? 'rotate-90' : ''"
      />
    </button>

    <div ref="contentRef">
      <!-- Only render content if it has ever been opened -->
      <div v-if="hasBeenOpened">
        <transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
        >
          <div v-show="isOpen">
            <slot />
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>
