<template>
  <div>
    <h1>Welcome to the homepage</h1>
    <header>
      <nav>
        <ul>
          <li><NuxtLink to="/about">About</NuxtLink></li>
          <li><NuxtLink to="/notes">Notes</NuxtLink></li>
          <li><NuxtLink to="/chat">Chat</NuxtLink></li>
          <li><NuxtLink to="/user">User</NuxtLink></li>
        </ul>
      </nav>
    </header>

    <AppAlert>
      This is an auto-imported component.
    </AppAlert>


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
    })
</script>

<style>
  img {
    width: 80%;
    filter: blur(.1rem);
  }
</style>
