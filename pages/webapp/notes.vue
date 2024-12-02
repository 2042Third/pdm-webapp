<script setup>
definePageMeta({
  layout: 'note'
});

const noteEditor = useNoteEditorStore();
const user = useUserStore();
const api = useApiStore();
const { performGetNotes } = useNotesAction();
const note = ref('');
const title = ref('');
const noteid = ref('');
const textareaRef = ref(null); // Reference for the textarea
const internalScrollElement = ref(null); // Reference for the actual scrollable element

noteEditor.$subscribe((mutation, state) => {
  note.value = state.note;
  title.value = state.title;
  noteid.value = state.noteid;
});

function getNotes() {
  performGetNotes(api.get_notes_url);
}

function saveNote() {
  noteEditor.setOpenNote({
    note: note.value,
    title: title.value,
    noteid: noteid.value,
  });
}

// Watch for changes in the note ID to restore the scroll position
watch(
    () => noteEditor.noteId,
    (newNoteId, oldNoteId) => {
      if (newNoteId !== oldNoteId) {
        restoreScrollPosition();
      }
    }
);

function changed() {
  return;
}

function saveScrollPosition() {
  if (textareaRef.value) {
    noteEditor.setScrollPosition(internalScrollElement.value.scrollTop);
  }
  else {
    console.log('[webapp/notes.vue] Saving scroll position: null');

  }
}

function restoreScrollPosition() {
  if (textareaRef.value) {
    nextTick(() => {
      console.log('[webapp/notes.vue] Restoring scroll position:', noteEditor.getScrollPosition());
      internalScrollElement.value.scrollTop = noteEditor.getScrollPosition();
    });

  }
  else {
    console.log('[webapp/notes.vue] Restring scroll position: null');

  }
}

onMounted(() => {
  note.value = noteEditor.note;
  title.value = noteEditor.title;
  noteid.value = noteEditor.noteid;

  if (user.isLoggedIn) {
    getNotes();
  }

  // Access the internal scrolling element inside UTextarea
  internalScrollElement.value = textareaRef.value?.$el?.querySelector('textarea, .scrollable-container');
  restoreScrollPosition();

  restoreScrollPosition(); // Restore scroll position when mounted
});

onBeforeUnmount(() => {
  saveScrollPosition(); // Save scroll position before unmounting
});
</script>

<template>
  <div class="w-full h-full">
    <NoteSideBar>
      <div class="flex h-full gap-6 mb-6 justify-center items-center">
        <CommonContainerDotted
            containerClass="max-w-prose w-full h-full"
            innerClass="h-full"
        >
          <UTextarea
              v-model="noteEditor.note"
              ref="textareaRef"
              class="w-full h-full text-md"
              placeholder="Note"
              color="white"
              textareaClass="h-full"
              @scroll="saveScrollPosition"
              @change="changed"
          />
        </CommonContainerDotted>
      </div>
    </NoteSideBar>
  </div>
</template>
