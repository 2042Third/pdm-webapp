<template>
  <div
      class="matte-glass cursor-pointer
      fixed inset-0 flex
      "
  >
  </div>
</template>

<script setup>

</script>

<style scoped>
.matte-glass {
  opacity: 0.9;
  padding: 20px;
  height: 100vh;

  /* From https://css.glass */
  background: rgba(255, 255, 255, 0.27);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
}

</style>
