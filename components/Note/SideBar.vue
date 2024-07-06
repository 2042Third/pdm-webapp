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

    <div :class="['right-menu', { 'open': isOpen }]">
      <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
        <ul class="space-y-2 font-medium">
          <!-- Add your menu items here -->
          <li v-for="item in menuItems" :key="item.id" class="w-full">
            <NuxtLink :to="item.link"
                      class="flex flex-row items-center gap-4 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
              <component :is="item.icon" v-if="item.icon" />
              {{ item.text }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>

    <div :class="['content-wrapper', { 'shifted': isOpen }]">
      <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)
const menuItems = ref([
  { id: 1, text: 'Option 1', link: '/option1', icon: 'LazyIconsSubwayHome' },
  { id: 2, text: 'Option 2', link: '/option2', icon: 'LazyIconsNoteDefault' },
  // Add more menu items as needed
])

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}
</script>

<style scoped>
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

.content-wrapper.shifted {
  margin-right: 256px; /* 16rem = 256px */
}

@media (max-width: 640px) {
  .content-wrapper.shifted {
    margin-right: 0;
  }
}
</style>
