<template>
  <div class="flex justify-center items-center">
    <div class="flex flex-col mb-6 p-4 gap-4 border-2
        border-gray-200 border-dashed rounded-lg dark:border-gray-700">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ContainerDotted'
}
</script>
