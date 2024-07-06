<template>
  <div class="right-menu-container">
    <button @click="toggleMenu" type="button"
            class="inline-flex flex-row items-center gap-4 p-2 mt-2 me-3 text-sm text-gray-500 rounded-lg
            hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200
            dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
      <span class="sr-only">Toggle right menu</span>
      <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
      </svg>
    </button>

    <div ref="menuRef" :class="['right-menu', { 'open': isOpen }, 'md:block']">
      <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
        <ul class="space-y-2 font-medium">
          <!-- Add your menu items here -->
          <li v-for="item in menuItems" :key="item.id" class="w-full">
            <div class="flex flex-row items-center gap-4 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
              <component :is="item.icon" v-if="item.icon" />
              {{ item.text }}
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div :class="['content-wrapper relative', { 'md:mr-64': isOpen }]">
      <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
        <slot />
      </div>
      <Transition name="fade">
        <CommonMatteOverlay  v-if="isOpen" @click="toggleMenu" />
      </Transition>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isOpen = ref(false);
const isMediumScreen = ref(false);
const menuRef = ref(null);

const menuItems = ref([
  { id: 1, text: 'Option 1', link: '/option1' },
  { id: 2, text: 'Option 2', link: '/option2' },
  { id: 3, text: 'Option 3', link: '/option3' },
  { id: 4, text: 'Option 4', link: '/option4' },
  { id: 5, text: 'Option 5', link: '/option5' },
  { id: 6, text: 'Option 6', link: '/option6' },
  { id: 7, text: 'Option 7', link: '/option7' },
  { id: 8, text: 'Option 8', link: '/option8' },
  { id: 9, text: 'Option 9', link: '/option9' },
  { id: 10, text: 'Option 10', link: '/option10' },
  // Add more menu items as needed
]);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
}

const checkScreenSize = () => {
  isMediumScreen.value = window.innerWidth < 768;
  if (isMediumScreen.value) {
    isOpen.value = false;
    console.log("[SideBar.checkScreenSize] Menu closed");
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
.right-menu-container {
  position: relative;
  height: 100%;
  width: 100%;
}

.right-menu {
  position: fixed;
  top: 0;
  right: -256px; /* 16rem = 256px */
  width: 256px; /* 16rem = 256px */
  height: 100vh;
  transition: right 0.3s ease-in-out;
  z-index: 30;
}

.right-menu.open {
  right: 0;
}

.content-wrapper {
  transition: margin-right 0.3s ease-in-out;
  padding: 1rem; /* Add padding to match the left sidebar layout */
}

@media (min-width: 768px) {
  .right-menu {
    right: 0;
  }

  .content-wrapper {
    margin-right: 256px;
    transition: margin-right 0.3s ease-in-out;
  }

  .content-wrapper.mr-64 {
    margin-left: 256px; /* 16rem = 256px */
  }
}
</style>
