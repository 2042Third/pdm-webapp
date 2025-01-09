export const useNoteEditorStore = defineStore('noteEditor', () => {
  const note = ref("");
  const title = ref("");
  const noteId = ref(null);
  const metadata = ref({
    noteid: -1,
    userid: -1,  // Changed from userId to userid for consistency
    h: "",
    intgrh: "",
    time: -1,
    update_time: -1,
    scroll_position: 0,
    deleted: 0,
  });
  const stagingData = ref({
    noteid: -1,
    userid: -1,
    ue_content: "",
    ue_heading: "",
    h: "",
    intgrh: "",
    time: -1,
    update_time: -1,
    deleted: 0,
  });
  const scrollPosition = ref(0);
  const notesOpened = ref({});

  const setMetadata = (note) => {
    metadata.value = {
      noteid: note.noteid,
      userid: note.userid, // Changed from userId to userid
      h: note.h,
      intgrh: note.intgrh,
      time: note.time,
      update_time: note.update_time,
      deleted: note.deleted,
      scroll_position: 0
    };

    if (!notesOpened.value[metadata.value.noteid]) {
      notesOpened.value[metadata.value.noteid] = { scroll_position: 0 };
    }
    metadata.value.scroll_position = notesOpened.value[metadata.value.noteid].scroll_position;
    scrollPosition.value = metadata.value.scroll_position;
  };

  function updateStagingData() {
    console.log('Current metadata:', metadata.value);
    console.log('Current note:', note.value);
    console.log('Current title:', title.value);

    stagingData.value = {
      noteid: metadata.value.noteid,
      userid: metadata.value.userid,
      ue_content: note.value,
      ue_heading: title.value,
      h: metadata.value.h,
      intgrh: metadata.value.intgrh,
      time: metadata.value.time,
      update_time: metadata.value.update_time,
      scroll_position: metadata.value.scroll_position,
      deleted: metadata.value.deleted
    };

    console.log("Staging Data", JSON.stringify(stagingData.value, null,2));
  }

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
    stagingData,
    updateStagingData,
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
