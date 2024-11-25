
export const useNotesAction = () => {
  const notes = useNotesStore();
  const user = useUserStore();
  const nuxt = useNuxtApp();

  const performGetNotes = async (url) => {
    try {

      const response = await $fetch(url, {
        method: 'GET',
        headers: {
          "Authorization": "Bearer " + user.sessionKey,
        }
      });
      console.log('Get Notes response:', response);

      if (response ) {
        for (const note of response) {
          const noteDec = {
            ...note,
            heading: note.heading?nuxt.$wasm.decrypt(user.contextHandle, note.heading):"",
            content: note.content?nuxt.$wasm.decrypt(user.contextHandle, note.content):"",
          };
          notes.addNoteToList(noteDec);
        }
        // router.push('/dashboard')
      } else {
        console.error('Get Notes failed: No notes received');
      }
    } catch (error) {
      console.error('Get Notes error:', error.response ? error.response._data : error.message);
      // Handle error (e.g., show error message to user)
    }
  }


  const performGetNotesPOST = async (url) => {
    try {

      const response = await $fetch(url, {
        method: 'GET',
        headers: {
          "Authorization": "Bearer " + user.sessionKey,
        }
      });
      console.log('Get Notes response:', response);

      if (response ) {
        for (const note of response) {
          const noteDec = {
            ...note,
            heading: note.heading?nuxt.$wasm.decrypt(user.contextHandle, note.heading):"",
            content: note.content?nuxt.$wasm.decrypt(user.contextHandle, note.content):"",
          };
          notes.addNoteToList(noteDec);
        }
        // router.push('/dashboard')
      } else {
        console.error('Get Notes failed: No notes received');
      }
    } catch (error) {
      console.error('Get Notes error:', error.response ? error.response._data : error.message);
      // Handle error (e.g., show error message to user)
    }
  }

  return { performGetNotes, performGetNotesPOST }
}
