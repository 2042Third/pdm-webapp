<template>
  <div>
<!--    <AnimateTeleport/>-->
    <AnimateTransition/>
  </div>
</template>

<script setup lang="ts">
  import AnimateTransition from "~/components/AnimateTransition.vue";

  definePageMeta({
    middleware: ["about"]
  });
  useSeoMeta({
    title: 'About Us',
    ogTitle: 'About Us',
    description: 'This is the about page.',
    ogDescription: 'This is the about page.',
    ogImage: 'https://example.com/image.png',
    twitterCard: 'summary_large_image',
  });
  console.log('About page loading done.');
</script>
