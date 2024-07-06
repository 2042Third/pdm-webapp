<template>
  <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
    <ul class="space-y-2 font-medium">
      <li class="w-full">
        <NuxtLink class="flex w-full items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">

          <LazyIconsAccount />
        </NuxtLink>
      </li>
      <li class="w-full">
        <NuxtLink  to="/webapp/"
                   class="flex flex-row items-center gap-4 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">

          <LazyIconsSubwayHome/> Home
        </NuxtLink>
      </li>


      <li class="w-full">
        <NuxtLink to="/webapp/notes"
                  class="flex flex-row items-center gap-4 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
          <LazyIconsNoteDefault/> Notes
        </NuxtLink>
      </li>

      <li class="w-full">
        <NuxtLink to="/webapp/chat"
                  class="flex flex-row items-center gap-4 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
          <LazyIconsChatDefault/> Chat
        </NuxtLink>
      </li>

      <li class="w-full">
        <NuxtLink to="/webapp/tools"
                  class="flex flex-row items-center gap-4 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
          <LazyIconsSubwayKey/> Tools
        </NuxtLink>
      </li>


      <li class="w-full">
        <NuxtLink to="/webapp/user"
                  class="flex flex-row items-center gap-4 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
          <LazyIconsAccount /> User
        </NuxtLink>
      </li>

      <li class="w-full">
        <NuxtLink to="/webapp/settings"
                  class="flex flex-row items-center gap-4 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
          <LazyIconsCog/> Settings
        </NuxtLink>
      </li>

      <li class="w-full">
        <NuxtLink to="/webapp/about"
                  class="flex flex-row items-center gap-4 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
          About
        </NuxtLink>
      </li>

    </ul>
  </div>
</template>
