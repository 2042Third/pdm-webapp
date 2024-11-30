<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">WebSocket Test</h1>
    <div class="mb-4">

        <CommonInputS id="user-id" v-model="userId" placeholder="User ID"
                      type="text" class="w-full h-full"
        />

      <label for="message" class="block mb-2">Message:</label>
      <input
          id="message"
          v-model="message"
          type="text"
          class="border p-2 w-full"
          @keyup.enter="sendMessage"
      />
      <button
          @click="sendMessage"
          class="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
          :disabled="!isConnected"
      >
        Send
      </button>
    </div>
    <div class="mb-4">
      <h2 class="text-xl font-semibold mb-2">Received Messages:</h2>
      <ul class="border p-2 h-60 overflow-y-auto" ref="messageList">
        <li v-for="(msg, index) in receivedMessages" :key="index" class="mb-1">
          {{ msg }}
        </li>
      </ul>
    </div>
    <div>
      <p>Status: {{ status }}</p>
      <button
          @click="connect"
          class="bg-green-500 text-white px-4 py-2 mt-2 rounded mr-2"
          :disabled="isConnected"
      >
        Connect
      </button>
      <button
          @click="disconnect"
          class="bg-red-500 text-white px-4 py-2 mt-2 rounded"
          :disabled="!isConnected"
      >
        Disconnect
      </button>
    </div>
    <div class="mt-4">
      <h3 class="text-lg font-semibold">Debug Info:</h3>
      <pre class="bg-gray-100 p-2 mt-2 overflow-x-auto">{{ JSON.stringify(debugInfo, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import {useApiStore} from "~/stores/apiStore.js"; useApiStore()
const {get_ws_test_url} = useApiStore()
const userId = ref('')
const message = ref('')
const receivedMessages = ref([])
const status = ref('Disconnected')
const isConnected = ref(false)
const debugInfo = reactive({
  lastAttempt: null,
  error: null,
  wsUrl: 'ws://127.0.0.1/ws', // Base WebSocket server endpoint
})

let websocket

// Reference to the message list element
const messageList = ref(null)

const connect = () => {
  debugInfo.lastAttempt = new Date().toISOString()
  const wsUrlWithUserId = `${get_ws_test_url}?userId=${encodeURIComponent(userId.value)}`
  websocket = new WebSocket(wsUrlWithUserId)

  websocket.onopen = () => {
    status.value = 'Connected'
    isConnected.value = true
    debugInfo.error = null
    console.log('WebSocket connected')
  }

  websocket.onmessage = (event) => {
    const receivedMessage = event.data
    if (receivedMessage !== "Heartbeat") {
      console.log('Received message:', receivedMessage)
      receivedMessages.value.push(receivedMessage)
      scrollToBottom() // Call scroll when a new message arrives
    } else {
      console.log('Heartbeat received')
    }
  }

  websocket.onclose = () => {
    status.value = 'Disconnected'
    isConnected.value = false
    console.log('WebSocket disconnected')
  }

  websocket.onerror = (error) => {
    status.value = 'Error'
    isConnected.value = false
    debugInfo.error = error.message
    console.error('WebSocket error:', error.message)
  }
}

const disconnect = () => {
  if (websocket) {
    websocket.close()
    console.log('WebSocket disconnected')
  }
}

const sendMessage = () => {
  if (message.value.trim() && isConnected.value) {
    websocket.send(message.value)
    console.log('Sent message:', message.value)
    message.value = ''
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    // Ensure the scroll is at the bottom of the message list after the DOM update
    if (messageList.value) {
      messageList.value.scrollTop = messageList.value.scrollHeight
    }
  })
}

onMounted(() => {
  status.value = 'Disconnected'
})

onUnmounted(() => {
  disconnect()
})
</script>
