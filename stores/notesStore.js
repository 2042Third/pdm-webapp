import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNotesStore = defineStore('notes', () => {
  const notesArray = ref([]);
  const notesSet = ref({});
  const sortingByLocal = ref("created"); // title, updated, created, id
  const sortingOrderDescLocal = ref(false);

  const sortingBy = computed({
    get: () => sortingByLocal.value,
    set: (value) => sortingByLocal.value = value
  });

  const sortingOrderDesc = computed({
    get: () => sortingOrderDescLocal.value,
    set: (value) => sortingOrderDescLocal.value = value
  });

  const notesList = computed(() => {
    return notesArray.value
      .map((noteid) => notesSet.value[noteid])
      .filter((note) => note && note.deleted !== 1)
      .sort((a, b) => {
        const order = sortingOrderDescLocal.value ? 1 : -1;
        switch (sortingByLocal.value) {
          case "title":
            return order * a.heading.localeCompare(b.heading);
          case "updated":
            return order * (a.update_time.localeCompare( b.update_time));
          case "created":
            return order * (a.time.localeCompare(b.time));
          case "id":
            return order * a.noteid.localeCompare(b.noteid);
          default:
            return order * (a.time.localeCompare(b.time));
        }
      });
  });

  function setNotesList(value) {
    notesArray.value = value;
  }

  function addNoteToList(note) {
    if (!notesArray.value.includes(note.noteid)) {
      notesArray.value.push(note.noteid);
    }
    notesSet.value[note.noteid] = note;
  }

  function addStagingNoteToList(note) {
    console.log("Adding staging note to list: ", note);
    if (!notesArray.value.includes(note.noteid)) {
      notesArray.value.push(note.noteid);
    }
    notesSet.value[note.noteid] = {
      noteid: note.noteid,
      userid: note.userid,
      content: note.ue_content,
      heading: note.ue_heading,
      h: note.h,
      intgrh: note.intgrh,
      time: note.time,
      update_time: note.update_time,
      scroll_position: note.scroll_position,
      deleted: note.deleted
    };
  }

  function setSortingBy(value) {
    sortingByLocal.value = value;
  }

  function setSortingOrderDesc(value) {
    sortingOrderDescLocal.value = value;
  }

  function toggleSortingOrder() {
    sortingOrderDescLocal.value = !sortingOrderDescLocal.value;
  }

  return {
    notesList,
    notesSet,
    setNotesList,
    addNoteToList,
    addStagingNoteToList,
    sortingBy,
    setSortingBy,
    sortingOrderDesc,
    setSortingOrderDesc,
    toggleSortingOrder
  };
});
