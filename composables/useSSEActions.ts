export const useSSEActions = () => {
  const sseStore = useSseStore();
  const apiStore = useApiStore();
  const performTestNotification = async (sessionKey) => {
    try {
      sseStore.setConnectionStatus ('Sending test notification...');
      const response = await $fetch(apiStore.get_sse_send_notification_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": "Bearer " + sessionKey,
        },
        body: JSON.stringify({ message: 'Test notification' }),
      })
      console.log('Test notification sent, response:', response)
      sseStore.setConnectionStatus ('Test notification sent');
    } catch (e) {
      console.error('Error sending test notification:', e)
    }
  }

  return {
    performTestNotification,
  }
}
