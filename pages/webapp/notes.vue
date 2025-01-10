<script setup>
definePageMeta({
  layout: 'note'
});

const {bigintToBase64} = useUtil();
const noteEditor = useNoteEditorStore();
const notesStore = useNotesStore();
const user = useUserStore();
const api = useApiStore();
const notesAction = useNotesAction();
const note = ref('');
const title = ref('');
const noteid = ref('');
const textareaRef = ref(null);
const internalScrollElement = ref(null);
const isSaving = ref(false);
const lastSaved = ref('Never');

noteEditor.$subscribe((mutation, state) => {
  note.value = state.note;
  title.value = state.title;
  noteid.value = state.metadata.noteid;
});

async function getNotes() {
  await notesAction.performGetNotes(api.get_notes_url);
}

async function saveNote() {
  isSaving.value = true;
  try {
    await noteEditor.updateStagingData();
    const out = await notesAction.performUpdateNote(api.get_notes_url, noteEditor.stagingData);
    if (out.success) {
      lastSaved.value = new Date().toLocaleString();
      notesStore.addStagingNoteToList(noteEditor.stagingData);
    }
    else {
      console.error('Error saving note:', out.data);
    }
  }
  catch (e) {
    console.error('Error saving note:', e);
  }
  finally {
    isSaving.value = false;
  }
}

watch(
    () => noteEditor.noteId,
    (newNoteId, oldNoteId) => {
      if (newNoteId !== oldNoteId) {
        restoreScrollPosition();
      }
    }
);

const characterCount = computed(() => noteEditor.note?.length || 0);
const wordCount = computed(() => {
  return noteEditor.note?.trim().split(/\s+/).filter(word => word.length > 0).length || 0;
});

function formatDate(timestamp) {
  if (!timestamp || timestamp === -1) return 'N/A';
  return new Date(timestamp).toLocaleString();
}

function changed() {
  return;
}

function saveScrollPosition() {
  if (textareaRef.value) {
    noteEditor.setScrollPosition(internalScrollElement.value.scrollTop);
  }
}

function restoreScrollPosition() {
  if (textareaRef.value) {
    nextTick(() => {
      internalScrollElement.value.scrollTop = noteEditor.getScrollPosition();
    });
  }
}

onMounted(() => {
  note.value = noteEditor.note;
  title.value = noteEditor.title;
  noteid.value = noteEditor.metadata.noteid;

  if (user.isLoggedIn) {
    getNotes();
  }

  internalScrollElement.value = textareaRef.value?.$el?.querySelector('textarea, .scrollable-container');
  restoreScrollPosition();
});

onBeforeUnmount(() => {
  saveScrollPosition();
});
</script>

<template>
  <div class="w-full h-full">
    <NoteSideBar>
      <!-- Added mx-auto for centering and px-4 for padding on small screens -->
      <div class="max-w-prose mx-auto px-4 h-full">
        <div class="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
          <!-- Note Metadata Header -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-4">
            <div class="flex items-center justify-between mb-4">
              <div class="flex-1">
                <UInput
                    v-model="noteEditor.title"
                    type="text"
                    placeholder="Note Title"
                    class="text-xl font-semibold bg-transparent border-0 focus:ring-0"
                    variant="none"
                />
              </div>
              <div class="flex items-center gap-2">
                <UButton
                    size="sm"
                    color="gray"
                    variant="soft"
                    :loading="isSaving"
                    @click="saveNote"
                >
                  Save
                </UButton>
              </div>
            </div>

            <!-- Metadata Display -->
            <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div class="flex items-center gap-1">
                <i class="i-heroicons-document-text"></i>
                <span>Note ID: {{ bigintToBase64(noteEditor.metadata.noteid )}}</span>
              </div>
              <div class="flex items-center gap-1">
                <i class="i-heroicons-clock"></i>
                <span>Created: {{ formatDate(noteEditor.metadata.time) }}</span>
              </div>
              <div class="flex items-center gap-1">
                <i class="i-heroicons-pencil"></i>
                <span>Updated: {{ formatDate(noteEditor.metadata.update_time) }}</span>
              </div>
            </div>
          </div>

          <!-- Editor Area -->
          <div class="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <CommonContainerDotted
                containerClass="h-full"
                innerClass="h-full"
            >
              <UTextarea
                  v-model="noteEditor.note"
                  ref="textareaRef"
                  class="w-full h-full text-md bg-transparent"
                  placeholder="Start writing your note here..."
                  color="white"
                  variant="none"
                  textareaClass="h-full resize-none border-0 focus:ring-0 dark:text-gray-100"
                  @scroll="saveScrollPosition"
                  @change="changed"
              />
            </CommonContainerDotted>
          </div>

          <!-- Status Bar -->
          <div class="mt-2 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 px-2">
            <div>
              <span>{{ characterCount }} characters</span>
              <span class="mx-2">•</span>
              <span>{{ wordCount }} words</span>
            </div>
            <div>
              <span>Last saved: {{ lastSaved }}</span>
            </div>
          </div>
        </div>
      </div>
    </NoteSideBar>
  </div>
</template>

<style scoped>
.u-textarea {
  min-height: 400px;
}
</style>
