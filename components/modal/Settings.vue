<script setup lang="ts">
const isOpen = ref(false)
</script>

<template>
  <div>
    <UButton label="Open" @click="isOpen = true" />

    <UModal v-model="isOpen">
      <div class="p-4">
        <h2 class="text-lg font-bold">Settings</h2>
        <p class="text-sm text-gray-500">Change your settings here</p>
        <div class="mt-4">
          <label for="theme" class="block mb-5 text-lg font-bold text-gray-900 dark:text-white"
          > Theme </label>
          <select id="theme" class="mb-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <div class="mt-4">
          <label for="lang" class="block mb-5 text-lg font-bold text-gray-900 dark:text-white"
          > Language </label>
          <select id="lang" class="mb-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option value="en">English</option>
            <option value="es">Spanish</option>
          </select>
        </div>
        <div class="mt-4">
          <label for="notif" class="block mb-5 text-lg font-bold text-gray-900 dark:text-white"
          > Notifications </label>
          <select id="notif" class="mb-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option value="on">On</option>
            <option value="off">Off</option>
          </select>
        </div>

        </div>
    </UModal>
  </div>
</template>
