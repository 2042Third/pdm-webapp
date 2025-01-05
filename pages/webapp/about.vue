<template>
    <UContainer class="py-16">
      <div class="max-w-3xl mx-auto space-y-12">
        <!-- Header Section -->
        <div class="text-center space-y-4">
          <UBadge color="primary" size="lg">PDM Notes</UBadge>
          <h1 class="text-4xl font-bold tracking-tight sm:text-5xl">
            End-to-End Encrypted Note-Taking
          </h1>
          <p class="text-lg leading-8 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A secure, privacy-focused note-taking application built with modern technologies.
          </p>
        </div>

        <!-- Tech Stack Section -->
        <UCard class="bg-gray-50 dark:bg-gray-900">
          <template #header>
            <h2 class="text-xl font-semibold">Technology Stack</h2>
          </template>

          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <UCard class="bg-white dark:bg-gray-800">
                <div class="text-center space-y-2">
                  <UIcon name="i-heroicons-server" class="text-3xl text-primary-500"/>
                  <h3 class="font-medium">Backend</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Go-powered distributed servers with PostgreSQL database, Redis cache, and RabbitMQ message broker
                  </p>
                </div>
              </UCard>

              <UCard class="bg-white dark:bg-gray-800">
                <div class="text-center space-y-2">
                  <UIcon name="i-heroicons-computer-desktop" class="text-3xl text-primary-500"/>
                  <h3 class="font-medium">Frontend</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Modern web app built with Nuxt 3
                  </p>
                </div>
              </UCard>

              <UCard class="bg-white dark:bg-gray-800">
                <div class="text-center space-y-2">
                  <UIcon name="i-heroicons-lock-closed" class="text-3xl text-primary-500"/>
                  <h3 class="font-medium">Security</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    In-app C++ encryption module compiled with WebAssembly
                  </p>
                </div>
              </UCard>
            </div>
          </div>
        </UCard>

        <!-- Source Code Section -->
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">Open Source</h2>
          </template>

          <div class="space-y-4">
            <p class="text-gray-600 dark:text-gray-400">
              All components of PDM Notes are open source and available for review:
            </p>
            <div class="grid grid-cols-1 gap-3">
              <ULink
                  v-for="(link, index) in sourceLinks"
                  :key="index"
                  :to="link.url"
                  external
                  target="_blank"
                  class="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <UIcon :name="link.icon" class="mr-3 text-primary-500"/>
                <span>{{ link.text }}</span>
                <UIcon name="i-heroicons-arrow-top-right-on-square" class="ml-auto"/>
              </ULink>
            </div>
          </div>
        </UCard>

        <!-- Team Section -->
        <UCard class="text-center">
          <template #header>
            <h2 class="text-xl font-semibold">One Man Team</h2>
          </template>

          <div class="flex justify-center items-center space-x-4">
            <div>
              <UAvatar
                  src="https://api.dicebear.com/7.x/initials/svg?seed=YY"
                  alt="Yi Yang"
                  size="lg"
              />
              <h3 class="mt-4 font-medium">Yi Yang</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Lead Developer</p>
            </div>
          </div>
        </UCard>
      </div>
    </UContainer>
</template>

<script setup lang="ts">

definePageMeta({
  middleware: ["about"]
});

useSeoMeta({
  title: 'About PDM Notes',
  ogTitle: 'About PDM Notes - Secure Note-Taking',
  description: 'PDM Notes is an end-to-end encrypted note-taking app with focus on privacy and security.',
  ogDescription: 'PDM Notes is an end-to-end encrypted note-taking app with focus on privacy and security.',
  twitterCard: 'summary_large_image',
});

const sourceLinks = [
  {
    text: 'Server Source Code',
    url: 'https://github.com/2042third/pdm-go-server',
    icon: 'i-heroicons-server'
  },
  {
    text: 'Frontend Source Code',
    url: 'https://github.com/2042Third/pdm-webapp',
    icon: 'i-heroicons-computer-desktop'
  },
  {
    text: 'PDM C++ Encryption Module',
    url: 'https://github.com/2042Third/pdm-crypt-module',
    icon: 'i-heroicons-lock-closed'
  }
];

console.log('About page loading done.');
</script>
