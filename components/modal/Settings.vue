

<template>
  <div>
    <UButton label="Open" @click="isOpen = true" />

    <UModal v-model="isOpen">
      <div class="p-4">
        <h2 class="text-lg font-bold">Settings</h2>
        <p class="text-sm text-gray-500">Change your settings here</p>
        <div class="mt-4">
          <label for="local-pass" class="block mb-5 text-lg font-bold text-gray-900 dark:text-white"
          > Stores Encrypted Key Locally </label>
          <select id="local-pass" v-model="localPass" @change="changeLocalPass"
                  class="mb-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option :value="true"  >Yes</option>
            <option :value="false">No</option>
          </select>
        </div>


        </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const userConfig = useUserConfigStore();
const isOpen = ref(false);

const localPass = ref(userConfig.storesPasswordLocally);

function changeLocalPass() {
  userConfig.setStoresPasswordLocally(localPass.value);
}
</script>
