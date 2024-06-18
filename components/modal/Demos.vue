<script setup lang="ts">
const isOpen = ref(false);
const items = [
  {
    label: 'Getting Started',
    icon: 'i-heroicons-information-circle',
    defaultOpen: true,
    disabled:false,
    slot: 'getting-started',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
  },
  {
    label: "Pinia Store",
    icon: 'i-material-symbols-storage',
    slot: "pinia-store",

  }

];

const counterStore = useCounterStore();

</script>

<template>
  <div>
    <UButton label="Open" @click="isOpen = true" />

    <UModal v-model="isOpen">
      <div class="p-4">
          <UAccordion :items="items" >
            <template #item="{ item }">
              <p class="italic text-gray-900 dark:text-white text-center">
                {{ item.content }}
              </p>
            </template>

            <template #getting-started>
              <h2 class="text-lg font-bold">Getting Started</h2>
              <p class="text-sm text-gray-500">Learn how to use this app</p>
            </template>

            <template #pinia-store >
              <h2 class="text-lg font-bold">Pinia Store Counter Demo</h2>
              <p class="text-sm text-gray-500">{{counterStore}}</p>

              <UButton @click="counterStore.increment" :ui="{ rounded: 'rounded-full' }">+</UButton>
              <UButton @click="counterStore.decrement" :ui="{ rounded: 'rounded-full' }">-</UButton>

            </template>
          </UAccordion>
      </div>
    </UModal>
  </div>
</template>
