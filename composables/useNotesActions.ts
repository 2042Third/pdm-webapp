
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

  const performCreateNote = async (url) => {
    try {

      const response = await $fetch(url, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + user.sessionKey,
        },
      });
      console.log('Create Note response:', response);

      if (response ) {
        await notes.addNoteToList(response);
        return {
          success: true,
          data: response,
        }
      } else {
        console.error('Create Note failed: No note created');
        return {
          success: false,
          data: 'Create Note failed: No note created',
        }
      }
    } catch (error) {
      console.error('Create Note error:', error.response ? error.response._data : error.message);
      // Handle error (e.g., show error message to user)
      return {
        success: false,
        data: error,
      }
    }
  }

  const performUpdateNote = async (url, note) => {
    try {
      console.log('Update Note:', JSON.stringify(note, null, 2));
      const enc_note = { // Not updating the time, because the server will do that
        noteid: note.noteid,
        userid: note.userid,
        h: nuxt.$wasm.get_hash(note.ue_content),
        intgrh: nuxt.$wasm.get_hash(note.ue_heading),
        heading: nuxt.$wasm.encrypt(user.contextHandle, note.ue_heading),
        content: nuxt.$wasm.encrypt(user.contextHandle, note.ue_content),
        deleted: note.deleted,
      }
      const response = await $fetch(url, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + user.sessionKey,
        },
        body: JSON.stringify(enc_note),
      });
      console.log('Update Note response:', response);
      if (response?.message === "note updated") {
        return {
          success: true,
          data: response,
        }
      }
      else {
        console.error('Update Note failed:', response?.message);
        return {
          success: false,
          data: response,
        }
      }
    } catch (error) {
      console.error('Update Note error:', error.response ? error.response._data : error.message);
      return {
        success: false,
        data: error,
      }
    }
  }

  return {
    performGetNotes,
    performGetNotesPOST,
    performCreateNote,
    performUpdateNote,
  }
}
