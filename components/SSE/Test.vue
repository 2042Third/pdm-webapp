<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4">SSE Notification System</h2>
    <div class="flex items-center space-x-4 mb-4">
      <button
          @click="toggleConnection"
          :disabled="sseStore.isConnecting"
          :class="{
          'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded': !sseStore.isConnected,
          'bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded': sseStore.isConnected,
          'opacity-50 cursor-not-allowed': sseStore.isConnecting
        }"
      >
        {{ connectionButtonText }}
      </button>
      <button
          @click="sendTestNotification"
          :disabled="!sseStore.isConnected"
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Send Test Notification
      </button>
    </div>
    <div v-if="sseStore.connectionStatus" class="text-yellow-500">Connection Status: {{ sseStore.connectionStatus }}</div>
    <div v-if="sseStore.error" class="text-red-500">{{ sseStore.error }}</div>
    <ul class="list-disc pl-5">
      <li
          v-for="notification in sseStore.notifications" :key="notification.id"
          class="mb-2 p-2 border-b border-gray-200"
      >
        {{ notification.message }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import {computed, onUnmounted, onMounted} from 'vue'
import {CustomEventSource} from "~/CustomEventSource.cjs"
import {useSseStore} from '~/stores/sseStore'
import {useApiStore} from '~/stores/apiStore'
import {useUserStore} from '~/stores/userStore'
import {useSSEActions} from '~/composables/useSSEActions'

const MAX_RETRIES = 5
let retryCount = 0
let retryTimeout = null
let heartbeatTimeout = null
let eventSource = null

const apiStore = useApiStore()
const userStore = useUserStore()
const sseStore = useSseStore()
const {performTestNotification} = useSSEActions()

const connectionButtonText = computed(() => {
  if (sseStore.isConnecting) return 'Connecting...'
  return sseStore.isConnected ? 'Disconnect' : 'Connect'
})

const toggleConnection = async () => {
  if (sseStore.isConnected) {
    console.log("Sending disconnect.")
    await disconnect()
  } else {
    console.log("Sending connect.")
    await connect()
  }
}

const connect = async () => {
  await disconnect()

  sseStore.setIsConnecting(true)
  sseStore.setError(null)
  sseStore.setConnectionStatus('Initiating connection...')
  console.log('Attempting to connect to SSE...')

  try {
    eventSource = new CustomEventSource(apiStore.get_sse_notifications_url, {
      withCredentials: true,
      headers: {
        "Authorization": "Bearer " + userStore.sessionKey
      }
    })

    eventSource.addEventListener('connected', (e) => {
      console.log('Received connected event', e)
      sseStore.setIsConnecting(false)
      sseStore.setIsConnected(true)
      sseStore.setConnectionStatus('Connected')
      startHeartbeatCheck()
    })

    eventSource.onopen = (e) => {
      console.log('SSE connection opened', e)
      retryCount = 0
    }

    eventSource.addEventListener('notification', (e) => {
      console.log('Received notification event', e)
      try {
        const notification = JSON.parse(e.data)
        sseStore.addNotification(notification)
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
        sseStore.addNotification(notification)
      } catch (err) {
        console.error('Error parsing SSE message:', err, 'Raw data:', e.data)
        sseStore.setError(`Error parsing message: ${err.message}`)
      }
    }

    eventSource.onerror = async (e) => {
      console.error('SSE connection error:', e)
      sseStore.setError(`SSE connection failed: ${e.type}`)
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
  console.log("Disconnecting from SSE...")
  await handleDisconnection()
}

const handleDisconnection = async () => {
  sseStore.setIsConnected(false)
  sseStore.setIsConnecting(false)
  sseStore.setConnectionStatus('Disconnected')

  if (eventSource) {
    eventSource.close()
    eventSource = null
    console.log("EventSource closed and nullified")
  }

  clearTimeout(retryTimeout)
  clearTimeout(heartbeatTimeout)
  retryCount = 0

  // Optionally, you might want to clear notifications here
  // sseStore.clearNotifications()

  // Wait a moment to ensure the connection is fully closed
  await new Promise(resolve => setTimeout(resolve, 1000))
}

const startHeartbeatCheck = () => {
  heartbeatTimeout = setTimeout(async () => {
    console.error('Heartbeat not received within expected time')
    await handleDisconnection()
    // Optionally, you can attempt to reconnect here
    // await connect()
  }, 620000) // Expect heartbeat every 300 seconds, wait 620 to account for what time you join.
}

const resetHeartbeatCheck = () => {
  clearTimeout(heartbeatTimeout)
  startHeartbeatCheck()
}

const sendTestNotification = async () => {
  await performTestNotification(userStore.sessionKey)
}

onMounted(() => {
  // Optionally, you can auto-connect here
  // connect()
})

onUnmounted(async () => {
  await disconnect()
})
</script>
