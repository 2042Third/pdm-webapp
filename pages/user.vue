<template>
  <div class="grid gap-6 mb-6 md:grid-cols-2">
    <div class="mb-6">
      <CommonInputS
          id="user-email-input"
          v-model="inputEmail"
          placeholder="Email"
          type="text"
          class=" mb-5"
          :on-clear="() => userEmail = ''"
      />
    </div>
  </div>
</template>

<script setup lang="ts">

</script>
