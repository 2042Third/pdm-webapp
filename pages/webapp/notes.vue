<template>
  <div class="w-full h-full" >
  <NoteSideBar>
    <div class="flex h-full gap-6 mb-6 justify-center items-center ">
      <CommonContainerDotted containerClass="max-w-prose w-full h-full "
                             innerClass="h-full ">
        <UTextarea
            v-model="note"
            class="w-full h-full text-md"
            placeholder="Note"
            color="white"
            textareaClass="h-full"
            @change="changed"
        />
      </CommonContainerDotted>


    </div>
  </NoteSideBar>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'note'
})

const noteEditor = useNoteEditorStore();
const user = useUserStore();
const api = useApiStore();
const { performGetNotes } = useNotesAction();
const note = ref('');
const title = ref('');
const noteid = ref('');

noteEditor.$subscribe((mutation, state) => {
  console.log(`[pages/notes.vue] Subscribed state: \n`+
      `note: ${JSON.stringify(state,null, 2)}\n`);
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
    noteid: noteid.value
  });
}

function changed(){
  return;
}

onMounted(() => {
  note.value = noteEditor.note;
  title.value = noteEditor.title;
  noteid.value = noteEditor.noteid;

  if (user.isLoggedIn) {
    getNotes();
  }
});


</script>

