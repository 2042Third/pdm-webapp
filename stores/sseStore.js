// stores/sseStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSseStore = defineStore('sseStore', () => {
  const connectionStatus = ref('')
  const isConnected = ref(false)
  const isConnecting = ref(false)
  const error = ref(null)
  const notifications = ref([])

  function setConnectionStatus(value) {
    connectionStatus.value = value
  }

  function setIsConnected(value) {
    isConnected.value = value
  }

  function setIsConnecting(value) {
    isConnecting.value = value
  }

  function setError(value) {
    error.value = value
  }

  function addNotification(notification) {
    notifications.value.push(notification)
  }

  function clearNotifications() {
    notifications.value = []
  }

  return {
    connectionStatus,
    isConnected,
    isConnecting,
    error,
    notifications,
    setConnectionStatus,
    setIsConnected,
    setIsConnecting,
    setError,
    addNotification,
    clearNotifications,
  }
})
