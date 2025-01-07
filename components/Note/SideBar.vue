<template>
  <div class="right-menu-container">
    <button @click="toggleMenu"
            type="button"
            class="toggle-menu-button inline-flex flex-row items-center gap-4 p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg
            md:hidden
            hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200
            dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
      <span class="sr-only">Toggle right menu</span>
      <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
      </svg>
    </button>

    <div ref="menuRef" :class="['right-menu', { 'open': isOpen }, 'md:block']">
      <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
        <div class="sticky top-0 bg-gray-50 dark:bg-gray-800  z-10">
          <client-only>
            <UButtonGroup size="sm" orientation="horizontal">
              <UButton label="Get Notes" color="white"
                       :disabled="!(user.isLoggedIn)"
                       @click="getNotes"
              />
              <UButton  label="New Note" color="white"
                        :loading="newNoteLoading"
                        :disabled="newNoteLoading || !(user.isLoggedIn)"
                        @click="createNote"
              />
              <UDropdown :items="sortingItems">
                <UButton>
                  <IconsSortingUp v-if="notes.sortingOrderDesc" />
                  <IconsSortingDown v-else />
                </UButton>

                <template #item="{ item }">
                  <div :class="sortingItemSelectClass(item.value)">
                    <span class="truncate">{{ item.label }}</span>

                    <IconsSortingUp v-if="item.value === notes.sortingBy && notes.sortingOrderDesc" />
                    <IconsSortingDown v-else-if="item.value === notes.sortingBy && !notes.sortingOrderDesc" />
                  </div>
                </template>
              </UDropdown>

            </UButtonGroup>
          </client-only>
        </div>
        <ul class="space-y-2 font-medium mt-4">
          <li v-for="note in notes.notesList" :key="note.noteid" class="w-full">
            <div class="flex flex-col items-start gap-1 p-2 text-gray-900 rounded-lg
                    dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer group"
                 @click="openNote(note.noteid)"
            >
              <h2 class="text-md font-semibold text-gray-800 dark:text-white">Note ID: {{ note.noteid }}</h2>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(note.time) }}</span>
              <p class="text-gray-600 dark:text-gray-300">{{ note.heading }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div :class="['content-wrapper  flex-grow', { 'md:mr-64': isOpen }]">
      <div class="p-4 h-full border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
        <slot />
      </div>
      <Transition name="fade">
        <CommonMatteOverlay  v-if="isOpen" @click="toggleMenu" />
      </Transition>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const user = useUserStore();
const api = useApiStore();
const notes = useNotesStore();
const isOpen = ref(false);
const isMediumScreen = ref(false);
const menuRef = ref(null);
const noteEditor = useNoteEditorStore();

const notesAction = useNotesAction();
const { unixToHumanReadableTime } = useUtil();

const newNoteLoading = ref(false);

const sortingItems = [
  [{ label: 'Sort by Updated At', value: 'updated', click: () => onSortingClick("updated")}],
  [{ label: 'Sort by Created At', value: 'created', click: () => onSortingClick("created")}],
  [{ label: 'Sort by Title', value: 'title', click: () => onSortingClick("title")}],
  [{ label: 'Sort by Note Id', value: 'noteid', click: () => onSortingClick('noteid') }],
];

function onSortingClick(itm) {
  console.log("[NoteSideBar] Sorting by clicked:", itm);
  if (itm !== notes.sortingBy) {
    console.log(`[NotesSideBar] Setting sorting by from "${notes.sortingBy}" to "${itm}"`);
    notes.setSortingBy(itm);
  } else {
    console.log(`[NotesSideBar] Toggling sorting order for "${itm}" to ${!notes.sortingOrderDesc}`);
    notes.toggleSortingOrder();
  }
}

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
}

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};

const checkScreenSize = () => {
  isMediumScreen.value = window.innerWidth < 768;
  if (isMediumScreen.value) {
    isOpen.value = false;
  }
}

async function getNotes() {
  await notesAction.performGetNotes(api.get_notes_url);
}

function openNote(noteid) {
  console.log('Opening note:', noteid);
  noteEditor.setOpenNote(notes.notesSet[noteid]);
}

async function createNote() {
  try {
    const out = await notesAction.performCreateNote(api.get_notes_url);
    if (out) {
      console.log('New note created:', out.data);
      openNote(out.noteid);
    } else {
      console.log('Failed to create new note: ' + out.data);
    }
  } catch (e) {
    console.error('Failed to create new note:', e);
  }
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})

const sortingItemSelectClass = computed(() => (itm) => {
  const selectedClasses = "bg-gray-100 dark:bg-gray-700";
  const normal = "flex flex-row items-center gap-4 p-2 text-gray-900 rounded-lg dark:text-white group";
  return {
    [normal]: true,
    [selectedClasses]: notes.sortingBy === itm
  };
});

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.right-menu-container {
  position: relative;
  height: 100%;
  width: 100%;
}

.right-menu {
  position: fixed;
  top: 0;
  right: -256px; /* 16rem = 256px */
  width: 256px; /* 16rem = 256px */
  height: 100vh;
  transition: right 0.3s ease-in-out;
  z-index: 30;
}

.right-menu.open {
  right: 0;
}

.content-wrapper {
  transition: margin-right 0.3s ease-in-out;
  height: 100%;
  padding: 1rem; /* Add padding to match the left sidebar layout */
}

@media (min-width: 768px) {
  .right-menu {
    right: 0;
  }

  .content-wrapper {
    margin-right: 256px;

    transition: margin-right 0.3s ease-in-out;
  }

  .content-wrapper.mr-64 {
    margin-left: 256px; /* 16rem = 256px */
  }
}
.toggle-menu-button {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 30;
}
</style>
