<template>
  <div class="flex flex-row gap-2">
    <div class="basis-4/5">
      <slot name="left"></slot>
    </div>
    <div class="basis-1/5">
      <slot name="right"></slot>
    </div>
  </div>
</template>
