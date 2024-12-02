export const useNoteEditorStore = defineStore('noteEditor', () => {
  const note = ref("");
  const title = ref("");
  const noteId = ref(null);
  const metadata = ref({
    noteid: -1,
    userId: -1,
    h: "",
    intgrh: "",
    time: -1,
    update_time: -1,
    scroll_position: 0,
    deleted: 0,
  });
  const scrollPosition = ref(0);
  const notesOpened = ref({}); // Track scroll positions for each note

  const setMetadata = (note) => {
    metadata.value.noteid = note.noteid;
    metadata.value.userId = note.userId;
    metadata.value.h = note.h;
    metadata.value.intgrh = note.intgrh;
    metadata.value.time = note.time;
    metadata.value.update_time = note.update_time;
    metadata.value.deleted = note.deleted;

    if (!notesOpened.value[metadata.value.noteid]) {
      notesOpened.value[metadata.value.noteid] = { scroll_position: 0 };
    }
    metadata.value.scroll_position = notesOpened.value[metadata.value.noteid].scroll_position;
    scrollPosition.value = metadata.value.scroll_position;
  };

  const setScrollPosition = (position) => {
    if (metadata.value.noteid !== -1) {
      notesOpened.value[metadata.value.noteid].scroll_position = position;
      scrollPosition.value = position;
    }
  };

  const getScrollPosition = () => scrollPosition.value;

  function setNote(value) {
    note.value = value;
  }

  function setTitle(value) {
    title.value = value;
  }

  function setNoteId(value) {
    noteId.value = value;
  }

  function setOpenNote(note) {
    if (!note) return;
    setTitle(note.heading);
    setNote(note.content);
    setNoteId(note.noteid);
    setMetadata(note);
  }

  return {
    note,
    title,
    noteId,
    setNote,
    setTitle,
    setNoteId,
    setOpenNote,
    metadata,
    setMetadata,
    scrollPosition,
    setScrollPosition,
    getScrollPosition,
    notesOpened,
  };
});
