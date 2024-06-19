<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <label class="font-medium">Open Settings</label>
      <ModalSettings />
    </div>

    <div class="space-y-2">
      <label class="font-medium">Demos</label>
      <ModalDemos />
    </div>

    <h1 class="text-2xl font-semibold">Settings</h1>
    <div class="space-y-4">
      <div class="space-y-2">
        <label for="name" class="font-medium">Name</label>
        <input type="text" id="name" class="w-full p-2 border border-gray-200 rounded-lg dark:border-gray-700" />
      </div>
      <div class="space-y-2">
        <label for="email" class="font-medium">Email</label>
        <input type="email" id="email" class="w-full p-2 border border-gray-200 rounded-lg dark:border-gray-700" />
      </div>
      <div class="space-y-2">
        <label for="password" class="font-medium">Password</label>
        <input type="password" id="password" class="w-full p-2 border border-gray-200 rounded-lg dark:border-gray-700" />
      </div>
      <div class="space-y-2">
        <label for="confirm-password" class="font-medium">Confirm Password</label>
        <input type="password" id="confirm-password" class="w-full p-2 border border-gray-200 rounded-lg dark:border-gray-700" />
      </div>
      <button class="w-full p-2 text-white bg-blue-500 rounded-lg">Save</button>
    </div>


  </div>
</template>
<script setup lang="ts">
</script>
