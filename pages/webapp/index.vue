<template>
  <div>
    <h1 class="text-4xl" >Welcome to the homepage</h1>


    <AppAlert>
      This is an auto-imported component.
    </AppAlert>
    <hr/>
    {{ $hello('world') }}
    <img src="/img/cmu.png" alt="Discover Nuxt 3" />
  </div>
</template>

<script setup lang="ts">
    useSeoMeta({
      title: 'PDM Notes',
      ogTitle: 'PDM Notes',
      description: 'End-to-end encrypted  notes app completely developed and open sourced by one person.',
      ogDescription: 'End-to-end encrypted  notes app completely developed and open sourced by one person.',
      ogImage: 'https://example.com/image.png',
      twitterCard: 'summary_large_image',
    });
    // console.log('Hello from the homepage');
</script>

<style>
  img {
    width: 80%;
    filter: blur(.1rem);
  }
</style>
