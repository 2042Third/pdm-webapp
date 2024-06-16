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
      title: 'My Amazing Site',
      ogTitle: 'My Amazing Site',
      description: 'This is my amazing site, let me tell you all about it.',
      ogDescription: 'This is my amazing site, let me tell you all about it.',
      ogImage: 'https://example.com/image.png',
      twitterCard: 'summary_large_image',
    });
    console.log('Hello from the homepage');
</script>

<style>
  img {
    width: 80%;
    filter: blur(.1rem);
  }
</style>
