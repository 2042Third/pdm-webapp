export class CustomEventSource {
  constructor(url, options = {}) {
    this.url = url;
    this.options = options;
    this.listeners = {};
    this.readyState = 0;
    this.connect();
  }

  connect() {
    this.readyState = 0; // CONNECTING
    this.abortController = new AbortController();

    fetch(this.url, {
      method: 'GET',
      headers: this.options.headers || {},
      credentials: this.options.withCredentials ? 'include' : 'same-origin',
      signal: this.abortController.signal
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.readyState = 1; // OPEN
      return this.readStream(response.body);
    }).catch(error => {
      this.readyState = 2; // CLOSED
      this.dispatchEvent('error', error);
    });
  }

  async readStream(stream) {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop();

        for (const line of lines) {
          this.processEventMessage(line);
        }
      }
    } catch (error) {
      this.dispatchEvent('error', error);
    } finally {
      this.readyState = 2; // CLOSED
      reader.releaseLock();
    }
  }

  processEventMessage(eventString) {
    const lines = eventString.split('\n');
    let eventType = 'message';
    let data = '';

    for (const line of lines) {
      if (line.startsWith('event:')) {
        eventType = line.slice(6).trim();
      } else if (line.startsWith('data:')) {
        data += line.slice(5).trim() + '\n';
      }
    }

    data = data.slice(0, -1); // Remove last newline
    this.dispatchEvent(eventType, { data });
  }

  addEventListener(type, callback) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(callback);
  }

  removeEventListener(type, callback) {
    if (this.listeners[type]) {
      this.listeners[type] = this.listeners[type].filter(cb => cb !== callback);
    }
  }

  dispatchEvent(type, event) {
    if (this.listeners[type]) {
      for (const callback of this.listeners[type]) {
        callback(event);
      }
    }
    if (type === 'message' && this.onmessage) {
      this.onmessage(event);
    }
  }

  close() {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.readyState = 2; // CLOSED
  }
}

// Usage in your component or store
const connect = async () => {
  await disconnect();
  isConnecting.value = true;
  error.value = null;
  connectionStatus.value = 'Initiating connection...';
  console.log('Attempting to connect to SSE...');

  try {
    const sessionKey = 'your-session-key-here'; // Replace with actual session key
    eventSource = new CustomEventSource(apiStore.get_sse_notifications_url, {
      withCredentials: true,
      headers: {
        'Session-Key': sessionKey
      }
    });

    eventSource.addEventListener('connected', (e) => {
      console.log('Received connected event', e);
      isConnecting.value = false;
      isConnected.value = true;
      connectionStatus.value = 'Connected';
      startHeartbeatCheck();
    });

    eventSource.addEventListener('open', (e) => {
      console.log('SSE connection opened', e);
      retryCount = 0;
    });

    eventSource.addEventListener('notification', (e) => {
      console.log('Received notification event', e);
      try {
        const notification = JSON.parse(e.data);
        notifications.value.push(notification);
      } catch (err) {
        console.error('Error parsing notification:', err, 'Raw data:', e.data);
      }
    });

    eventSource.addEventListener('heartbeat', (e) => {
      console.log('Received heartbeat', e);
      resetHeartbeatCheck();
    });

    eventSource.onmessage = (e) => {
      console.log('SSE message received', e);
      try {
        const notification = JSON.parse(e.data);
        notifications.value.push(notification);
      } catch (err) {
        console.error('Error parsing SSE message:', err, 'Raw data:', e.data);
        error.value = `Error parsing message: ${err.message}`;
      }
    };

    eventSource.addEventListener('error', async (e) => {
      console.error('SSE connection error:', e);
      error.value = `SSE connection failed: ${e.type}`;
      await handleDisconnection();
      if (retryCount < MAX_RETRIES) {
        retryCount++;
        const delay = Math.min(1000 * 2 ** retryCount, 30000);
        console.log(`Retrying connection in ${delay}ms...`);
        retryTimeout = setTimeout(connect, delay);
      } else {
        console.error('Max retries reached. Please try reconnecting manually.');
      }
    });
  } catch (err) {
    console.error('Error setting up SSE connection:', err);
    await handleDisconnection();
  }
};
