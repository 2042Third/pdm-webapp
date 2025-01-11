<template>
  <div class="right-menu-container">
    <!-- Toggle button remains the same -->
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
        <!-- Top controls section -->
        <div class="sticky top-0 bg-gray-50 dark:bg-gray-800 z-10 pb-4 border-b dark:border-gray-700">
          <client-only>
            <UButtonGroup size="sm" orientation="horizontal" class="w-full">
              <UButton
                  label="Get Notes"
                  color="white"
                  :disabled="!user.isLoggedIn"
                  @click="getNotes"
                  icon="i-heroicons-arrow-path"
                  class="flex-1"
              />
              <UButton
                  label="New Note"
                  color="white"
                  :loading="newNoteLoading"
                  :disabled="newNoteLoading || !user.isLoggedIn"
                  @click="createNote"
                  icon="i-heroicons-plus"
                  class="flex-1"
              />
              <UDropdown :items="sortingItems" :popper="{ placement: 'bottom-end' }">
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

        <!-- Notes list -->
        <ul class="space-y-2 font-medium mt-4">
          <li v-for="note in notes.notesList"
              :key="note.noteid"
              class="w-full group relative">
            <!-- Note item -->
            <div class="flex flex-row items-start justify-between p-3 text-gray-900 rounded-lg
                        dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                 @click="openNote(note.noteid)">
              <div class="flex flex-col gap-1 flex-1 min-w-0">
                <h2 class="text-md font-semibold text-gray-800 dark:text-white truncate">
                  {{ note.heading || "Untitled" }}
                </h2>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatDateRelative(note.time) }}
                </span>
              </div>

              <!-- Note actions menu -->
              <UDropdown
                  :items="getNoteActions(note)"
                  :popper="{ placement: 'bottom-end' }"
                  @click.stop
              >
                <UButton
                    color="gray"
                    variant="ghost"
                    icon="i-heroicons-ellipsis-vertical"
                    class="opacity-0 group-hover:opacity-100"
                />
              </UDropdown>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div :class="['content-wrapper flex-grow', { 'md:mr-64': isOpen }]">
      <div class="p-4 h-full border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
        <slot />
      </div>
      <Transition name="fade">
        <CommonMatteOverlay v-if="isOpen" @click="toggleMenu" />
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { formatDistanceToNow } from 'date-fns';

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

// Note actions menu generator
const getNoteActions = (note) => [
  [{
    label: 'Rename',
    icon: 'i-heroicons-pencil',
    click: () => renameNote(note)
  }],
  [{
    label: 'Duplicate',
    icon: 'i-heroicons-document-duplicate',
    click: () => duplicateNote(note)
  }],
  [{
    label: 'Copy Note ID',
    icon: 'i-heroicons-document-text',
    click: () => copyNoteId(note)
  }],
  [{
    label: 'Delete',
    icon: 'i-heroicons-trash',
    class: 'text-red-500 dark:text-red-400',
    click: () => deleteNote(note)
  }]
];

// Note actions
async function renameNote(note) {
  // Implement rename logic
}

async function duplicateNote(note) {
  // Implement duplicate logic
}

function copyNoteId(note) {
  navigator.clipboard.writeText(note.noteid);
}

async function deleteNote(note) {
  const out = await notesAction.performDeleteNote(api.get_notes_url, {
    noteid: note.noteid,
    deletePermanently: false,
  });
  if (out) {
    console.log('Note deleted:', note.noteid);
  } else {
    console.error('Failed to delete note:', note.noteid);
  }
}

// Format date to relative time
function formatDateRelative(timestamp) {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
}

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

// const sortingItemSelectClass = computed(() => (itm) => {
//   const selectedClasses = "bg-gray-100 dark:bg-gray-700";
//   const normal = "flex flex-row items-center gap-4 p-2 text-gray-900 rounded-lg dark:text-white group";
//   return {
//     [normal]: true,
//     [selectedClasses]: notes.sortingBy === itm
//   };
// });
const sortingItemSelectClass = computed(() => (itm) => ({
  'flex flex-row items-center gap-4 p-2 text-gray-900 rounded-lg dark:text-white group': true,
  'bg-gray-100 dark:bg-gray-700': notes.sortingBy === itm
}));

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
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
  right: -256px;
  width: 256px;
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
  padding: 1rem;
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
    margin-right: 256px;
  }
}

.toggle-menu-button {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 30;
}
</style>
