<template>
  <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
    <ul class="space-y-2 font-medium">
      <li class="w-full">
        <div
            :class="getLinkClasses('/webapp/account')"
        >
          <LazyIconsAccount />
        </div>
      </li>
      <li class="w-full">
        <NuxtLink
            to="/webapp/"
            :class="getLinkClasses('/webapp/')"
        >
          <LazyIconsSubwayHome/> Home
        </NuxtLink>
      </li>
      <li class="w-full">
        <NuxtLink
            to="/webapp/notes"
            :class="getLinkClasses('/webapp/notes')"
        >
          <LazyIconsNoteDefault/> Notes
        </NuxtLink>
      </li>
      <li class="w-full">
        <NuxtLink
            to="/webapp/chat"
            :class="getLinkClasses('/webapp/chat')"
        >
          <LazyIconsChatDefault/> Chat
        </NuxtLink>
      </li>
      <li class="w-full">
        <NuxtLink
            to="/webapp/tools"
            :class="getLinkClasses('/webapp/tools')"
        >
          <LazyIconsSubwayKey/> Tools
        </NuxtLink>
      </li>
      <li class="w-full">
        <NuxtLink
            to="/webapp/user"
            :class="getLinkClasses('/webapp/user')"
        >
          <LazyIconsAccount /> User
        </NuxtLink>
      </li>
      <li class="w-full">
        <NuxtLink
            to="/webapp/settings"
            :class="getLinkClasses('/webapp/settings')"
        >
          <LazyIconsCog/> Settings
        </NuxtLink>
      </li>
      <li class="w-full">
        <NuxtLink
            to="/webapp/about"
            :class="getLinkClasses('/webapp/about')"
        >
          About
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup>

const route = useRoute()
const appStates = appStatesStore()


const getLinkClasses = (routeName) => {
  const baseClasses = "flex flex-row items-center gap-4 p-2 text-gray-900 rounded-lg dark:text-white group"
  const selectedClasses = "bg-gray-100 dark:bg-gray-1000"

  return {
    [baseClasses]: true,
    [selectedClasses]: route.path === routeName
  }
}
</script>
