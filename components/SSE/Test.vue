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
import { ref, computed, onUnmounted } from 'vue'

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

const connectionButtonText = computed(() => {
  if (isConnecting.value) return 'Connecting...'
  return isConnected.value ? 'Disconnect' : 'Connect'
})

const toggleConnection = () => {
  if (isConnected.value) {
    console.log("Sending disconnect.");
    disconnect()
  } else {
    console.log("Sending connect.");
    connect()
  }
}

const connect = () => {
  isConnecting.value = true
  error.value = null
  connectionStatus.value = 'Initiating connection...'
  console.log('Attempting to connect to SSE...')

  eventSource = new EventSource('http://10.0.0.189/sse-stream/notification', { withCredentials: true })

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

  eventSource.onerror = (e) => {
    console.error('SSE connection error:', e)
    error.value = `SSE connection failed: ${e.type}`
    isConnected.value = false
    isConnecting.value = false
    connectionStatus.value = 'Connection failed'
    closeEventSource()
    clearTimeout(heartbeatTimeout)

    if (retryCount < MAX_RETRIES) {
      retryCount++
      const delay = Math.min(1000 * 2 ** retryCount, 30000)
      console.log(`Retrying connection in ${delay}ms...`)
      retryTimeout = setTimeout(connect, delay)
    } else {
      console.error('Max retries reached. Please try reconnecting manually.')
    }
  }
}

const disconnect = () => {
  if (eventSource) {
    console.log("Disconnecting from SSE...");
    closeEventSource()
    isConnected.value = false
    connectionStatus.value = 'Disconnected'
    clearTimeout(retryTimeout)
    clearTimeout(heartbeatTimeout)
    retryCount = 0
  } else {
    console.log("No connection to disconnect from SSE...");
  }
}

const closeEventSource = () => {
  if (eventSource) {
    eventSource.close()
    eventSource = null
    console.log("EventSource closed and nullified")
  }
}

const startHeartbeatCheck = () => {
  heartbeatTimeout = setTimeout(() => {
    console.error('Heartbeat not received within expected time')
    closeEventSource()
    // Optionally, you can attempt to reconnect here
    // connect()
  }, 62000) // Expect heartbeat every 30 seconds, wait 62 to account for what time you join.
}

const resetHeartbeatCheck = () => {
  clearTimeout(heartbeatTimeout)
  startHeartbeatCheck()
}

const sendTestNotification = async () => {
  try {
    connectionStatus.value = 'Sending test notification...'
    const response = await fetch('http://10.0.0.189/sse-stream/send-notification', {
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

onUnmounted(() => {
  disconnect()
})
</script>
