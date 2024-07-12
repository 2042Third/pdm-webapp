import { defineStore } from 'pinia'

export const useNotesStore =
  defineStore('notes', () => {
  const notesArray = ref([]);
  const notesSet = ref({});

  const notesList = computed(() =>
    notesArray.value.filter((note) => note.deleted !== 1));

  function setNotesList(value) {
    notesArray.value = value;
  }

  function addNoteToList(note) {
    notesArray.value.push(note);
    notesSet.value[note.noteid] = note;
  }

  return {
    notesList,
    notesSet,
    setNotesList,
    addNoteToList
  };
});

