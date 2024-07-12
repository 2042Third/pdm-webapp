export const useNoteEditorStore =
defineStore('noteEditor', () => {
  const note = ref("");
  const title = ref("");
  const noteId = ref(null);
  const metadata = ref({
    userId: -1,
    h: "",
    intgrh: "",
    time: -1,
    update_time: -1,
    deleted: 0,
  });

  const setMetadata = (note) => {
    metadata.value.userId = note.userId;
    metadata.value.h = note.h;
    metadata.value.intgrh = note.intgrh;
    metadata.value.time = note.time;
    metadata.value.update_time = note.update_time;
    metadata.value.deleted = note.deleted;
  }

  function setNote(value) {
    note.value = value;
  }

  function setTitle(value) {
    title.value = value;
  }

  function setNoteId(value) {
    noteId.value = value;
  }

  function setOpenNote(note){
    console.log(`Open Note State:\n${JSON.stringify(note, null, 2)}`);
    if(!note) return;
    setTitle(note.heading);
    setNote(note.content);
    setNoteId(note.noteid);
    setMetadata(note);
  }

  return {
    note, title, noteId, setNote, setTitle, setNoteId,
    setOpenNote, metadata, setMetadata
  };
});
