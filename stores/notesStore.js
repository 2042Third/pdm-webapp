import { defineStore } from 'pinia'

export const useNotesStore =
  defineStore('notes', () => {
  const notesList = ref([])

  function setNotesList(value) {
    notesList.value = value
  }

  function addNoteToList(note) {
    notesList.value.push(note)
  }

  return {
    notesList,
    setNotesList,
    addNoteToList
  }
})

