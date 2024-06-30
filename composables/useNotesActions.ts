
export const useNotesAction = () => {
  const notes = useNotesStore();
  const user = useUserStore();

  const performGetNotes = async (url) => {
    try {

      const response = await $fetch(url, {
        method: 'GET',
        headers: {
          "Session-Key": user.sessionKey,
        }
      });
      console.log('Get Notes response:', response);

      if (response ) {
        for (const note of response) {
          notes.addNoteToList(note);
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

  return { performGetNotes }
}
