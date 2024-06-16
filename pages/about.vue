<template>
  <section>
    <p>This page will be displayed at the /about route.</p>
  </section>
</template>

<script setup lang="ts">
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
