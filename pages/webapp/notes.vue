<template>
  <NoteSideBar>
    <div class="flex flex-grow gap-6 mb-6 justify-center items-center ">
      <CommonContainerDotted containerClass="max-w-prose w-full h-full " innerClass="flex flex-col gap-4">
        <UTextarea
        />
      </CommonContainerDotted>
    </div>
  </NoteSideBar>
</template>

<script setup>
definePageMeta({
  layout: 'note'
})
</script>

