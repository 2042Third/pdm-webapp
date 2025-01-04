<template>
  <Teleport to="body">
    <Transition name="modal-transition">
      <div v-if="modelValue"
           class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
           @click="handleBackdropClick">
        <!-- Backdrop with blur effect -->
        <div class="fixed inset-0 bg-black/30 backdrop-blur-sm"></div>

        <!-- Modal content -->
        <div class="relative w-full max-w-lg rounded-lg bg-white shadow-xl dark:bg-gray-800"
             ref="modalRef"
             :class="{ 'animate-shake': attemptClose }">
          <!-- Header with optional close button -->
          <div v-if="!hideHeader"
               class="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              {{ title }}
            </h3>
            <button v-if="!hideCloseButton"
                    @click="close"
                    class="text-gray-400 hover:text-gray-500 focus:outline-none">
              <span class="sr-only">Close</span>
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Modal body -->
          <div class="p-4">
            <slot></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  hideCloseButton: {
    type: Boolean,
    default: false
  },
  hideHeader: {
    type: Boolean,
    default: false
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue'])
const modalRef = ref(null)
const attemptClose = ref(false)

// Handle clicking outside the modal
const handleBackdropClick = (event) => {
  if (!props.closeOnBackdrop) {
    return
  }

  const modalContent = modalRef.value
  if (modalContent && !modalContent.contains(event.target)) {
    close()
  }
}

// Close modal function
const close = () => {
  emit('update:modelValue', false)
}

// Handle escape key
onMounted(() => {
  const handleEscape = (event) => {
    if (event.key === 'Escape' && props.modelValue && !props.hideCloseButton) {
      close()
    }
  }

  window.addEventListener('keydown', handleEscape)

  onUnmounted(() => {
    window.removeEventListener('keydown', handleEscape)
  })
})
</script>

<style scoped>
.modal-transition-enter-active,
.modal-transition-leave-active {
  transition: opacity 0.3s ease;
}

.modal-transition-enter-from,
.modal-transition-leave-to {
  opacity: 0;
}

.animate-shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }
  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>
