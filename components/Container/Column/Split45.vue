<template>
  <div class="grid grid-cols-5 gap-2 w-full items-start">
    <div class="col-span-4 w-full h-full ">
      <slot name="left"></slot>
    </div>
    <div class="col-span-1 w-full h-full ">
      <slot name="right"></slot>
    </div>
  </div>
</template>
