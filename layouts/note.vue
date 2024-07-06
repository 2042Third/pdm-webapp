<template>
  <div class=" AppHeader ">

    <button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar"
            aria-controls="default-sidebar" type="button"
            class="inline-flex flex-row items-center gap-4 p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg
            sm:hidden
            hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200
            dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
      <span class="sr-only">Open sidebar</span>
      <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
      </svg>
    </button>

    <aside id="default-sidebar"
           class="fixed top-0 left-0 z-40 w-64 h-screen
                transition-transform -translate-x-full sm:translate-x-0"
           aria-label="Sidebar">
      <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
        <ul class="space-y-2 font-medium">
          <li class="w-full">
            <NuxtLink class="flex w-full items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">

              <LazyIconsAccount />
            </NuxtLink>
          </li>
          <li class="w-full">
            <NuxtLink  to="/webapp/"
                       class="flex flex-row items-center gap-4 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">

              <LazyIconsSubwayHome/> Home
            </NuxtLink>
          </li>


          <li class="w-full">
            <NuxtLink to="/webapp/notes"
                      class="flex flex-row items-center gap-4 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
              <LazyIconsNoteDefault/> Notes
            </NuxtLink>
          </li>

          <li class="w-full">
            <NuxtLink to="/webapp/chat"
                      class="flex flex-row items-center gap-4 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
              <LazyIconsChatDefault/> Chat
            </NuxtLink>
          </li>

          <li class="w-full">
            <NuxtLink to="/webapp/tools"
                      class="flex flex-row items-center gap-4 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
              <LazyIconsSubwayKey/> Tools
            </NuxtLink>
          </li>


          <li class="w-full">
            <NuxtLink to="/webapp/user"
                      class="flex flex-row items-center gap-4 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
              <LazyIconsAccount /> User
            </NuxtLink>
          </li>

          <li class="w-full">
            <NuxtLink to="/webapp/settings"
                      class="flex flex-row items-center gap-4 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
              <LazyIconsCog/> Settings
            </NuxtLink>
          </li>

          <li class="w-full">
            <NuxtLink to="/webapp/about"
                      class="flex flex-row items-center gap-4 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
              About
            </NuxtLink>
          </li>

        </ul>
      </div>
    </aside>

    <div class="sm:ml-64">
        <slot />
    </div>
  </div>

  <AppFooter />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import {initDrawers, } from 'flowbite'

// Initialize the drawers
onMounted(() => {
  initDrawers();
})
</script>
