<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4">SSE Notification System</h2>
    <div class="flex items-center space-x-4 mb-4">
      <button
          @click="toggleConnection"
          :disabled="isConnecting"
          :class="{
          'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded': !isConnected,
          'bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded': isConnected,
          'opacity-50 cursor-not-allowed': isConnecting
        }"
      >
        {{ connectionButtonText }}
      </button>
      <button
          @click="sendTestNotification"
          :disabled="!isConnected"
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Send Test Notification
      </button>
    </div>
    <div v-if="connectionStatus" class="text-yellow-500">Connection Status: {{ connectionStatus }}</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>
    <ul class="list-disc pl-5">
      <li
          v-for="notification in notifications" :key="notification.id"
          class="mb-2 p-2 border-b border-gray-200"
      >
        {{ notification.message }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, onMounted } from 'vue'

const notifications = ref([])
const isConnected = ref(false)
const isConnecting = ref(false)
const error = ref(null)
const connectionStatus = ref('')
let eventSource = null
const MAX_RETRIES = 5
let retryCount = 0
let retryTimeout = null
let heartbeatTimeout = null
const apiStore = useApiStore();

const connectionButtonText = computed(() => {
  if (isConnecting.value) return 'Connecting...'
  return isConnected.value ? 'Disconnect' : 'Connect'
})

const toggleConnection = async () => {
  if (isConnected.value) {
    console.log("Sending disconnect.");
    await disconnect()
  } else {
    console.log("Sending connect.");
    await connect()
  }
}

const connect = async () => {
  // Ensure any existing connection is closed before starting a new one
  await disconnect()

  isConnecting.value = true
  error.value = null
  connectionStatus.value = 'Initiating connection...'
  console.log('Attempting to connect to SSE...')

  try {
    eventSource = new EventSource(apiStore.get_sse_notifications_url, { withCredentials: true })

    eventSource.addEventListener('connected', (e) => {
      console.log('Received connected event', e);
      isConnecting.value = false;
      isConnected.value = true;
      connectionStatus.value = 'Connected';
      startHeartbeatCheck();
    });

    eventSource.onopen = (e) => {
      console.log('SSE connection opened', e);
      retryCount = 0;
    };

    eventSource.addEventListener('notification', (e) => {
      console.log('Received notification event', e)
      try {
        const notification = JSON.parse(e.data)
        notifications.value.push(notification)
      } catch (err) {
        console.error('Error parsing notification:', err, 'Raw data:', e.data)
      }
    })

    eventSource.addEventListener('heartbeat', (e) => {
      console.log('Received heartbeat', e)
      resetHeartbeatCheck()
    })

    eventSource.onmessage = (e) => {
      console.log('SSE message received', e)
      try {
        const notification = JSON.parse(e.data)
        notifications.value.push(notification)
      } catch (err) {
        console.error('Error parsing SSE message:', err, 'Raw data:', e.data)
        error.value = `Error parsing message: ${err.message}`
      }
    }

    eventSource.onerror = async (e) => {
      console.error('SSE connection error:', e)
      error.value = `SSE connection failed: ${e.type}`
      await handleDisconnection()

      if (retryCount < MAX_RETRIES) {
        retryCount++
        const delay = Math.min(1000 * 2 ** retryCount, 30000)
        console.log(`Retrying connection in ${delay}ms...`)
        retryTimeout = setTimeout(connect, delay)
      } else {
        console.error('Max retries reached. Please try reconnecting manually.')
      }
    }
  } catch (err) {
    console.error('Error setting up SSE connection:', err)
    await handleDisconnection()
  }
}

const disconnect = async () => {
  console.log("Disconnecting from SSE...");
  await handleDisconnection()
}

const handleDisconnection = async () => {
  isConnected.value = false
  isConnecting.value = false
  connectionStatus.value = 'Disconnected'

  if (eventSource) {
    eventSource.close()
    eventSource = null
    console.log("EventSource closed and nullified")
  }

  clearTimeout(retryTimeout)
  clearTimeout(heartbeatTimeout)
  retryCount = 0

  // Optionally, you might want to clear notifications here
  // notifications.value = []

  // Wait a moment to ensure the connection is fully closed
  await new Promise(resolve => setTimeout(resolve, 1000))
}

const startHeartbeatCheck = () => {
  heartbeatTimeout = setTimeout(async () => {
    console.error('Heartbeat not received within expected time')
    await handleDisconnection()
    // Optionally, you can attempt to reconnect here
    // await connect()
  }, 62000) // Expect heartbeat every 30 seconds, wait 62 to account for what time you join.
}

const resetHeartbeatCheck = () => {
  clearTimeout(heartbeatTimeout)
  startHeartbeatCheck()
}

const sendTestNotification = async () => {
  try {
    connectionStatus.value = 'Sending test notification...'
    const response = await fetch(apiStore.get_sse_send_notification_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: 'Test notification' }),
    })
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    const responseText = await response.text()
    console.log('Test notification sent, response:', responseText)
    connectionStatus.value = 'Test notification sent'
  } catch (e) {
    console.error('Error sending test notification:', e)
    error.value = `Failed to send notification: ${e.message}`
  }
}

onMounted(() => {
  // Optionally, you can auto-connect here
  // connect()
})

onUnmounted(async () => {
  await disconnect()
})
</script>
