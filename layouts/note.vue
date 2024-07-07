<template>
  <div class="left-menu-container">
    <button @click="toggleMenu"
            type="button"
            class="toggle-menu-button inline-flex flex-row items-center gap-4 p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg
            lg:hidden
            hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200
            dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
      <span class="sr-only">Toggle left menu</span>
      <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
      </svg>
    </button>

    <div class="inline-flex flex-row items-center gap-4 p-2 mt-2 me-3
            lg:hidden">
      <span class="sr-only">Toggle right menu</span>
      <svg class="w-6 h-6" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      </svg>
    </div>

    <div ref="menuRef" :class="['left-menu', { 'open': isOpen }, 'lg:block']">

      <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
        <MainNav/>
      </div>
    </div>

    <div :class="['content-wrapper relative', { 'lg:ml-64': isOpen }]">
      <slot />
      <Transition name="fade">
        <CommonMatteOverlay v-if="isOpen && !isLargeScreen" style="z-index: 31" @click="toggleMenu" />
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const isOpen = ref(false);
const isLargeScreen = ref(false);
const menuRef = ref(null);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
}

const checkScreenSize = () => {
  isLargeScreen.value = window.innerWidth >= 1024; // 1024px is the default breakpoint for 'lg' in Tailwind
  if (isLargeScreen.value) {
    isOpen.value = true;
  } else {
    isOpen.value = false;
  }
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.left-menu-container {
  position: relative;
  height: 100%;
  width: 100%;
}

.left-menu {
  position: fixed;
  top: 0;
  left: -256px; /* 16rem = 256px */
  width: 256px; /* 16rem = 256px */
  height: 100vh;
  transition: left 0.3s ease-in-out;
  z-index: 32;
}

.left-menu.open {
  left: 0;
}

.content-wrapper {
  transition: margin-left 0.3s ease-in-out;
  padding: 1rem;
}

@media (min-width: 1024px) {
  .left-menu {
    left: 0;
  }

  .content-wrapper {
    margin-left: 0;
    transition: margin-left 0.3s ease-in-out;
  }

  .content-wrapper.lg\:ml-64 {
    margin-left: 256px; /* 16rem = 256px */
  }
}

.toggle-menu-button {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 30;
}
</style>
