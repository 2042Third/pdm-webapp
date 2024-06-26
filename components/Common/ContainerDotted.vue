<template>
  <div :class="containerClass">
    <div class="w-full p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
      <div :class="innerClass">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    containerClass: {
      type: String,
      default: ''
    },
    innerClass: {
      type: String,
      default: ''
    },
  },

}
</script>
