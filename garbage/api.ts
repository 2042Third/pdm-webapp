
export default defineNuxtPlugin((nuxtApp) => {
  const api = useApi()  // Your existing useApi composable

  api.interceptors.request.use(async (config) => {
    if (!config.headers['X-XSRF-TOKEN']) {
      // Fetch a new CSRF token
      await $fetch('/api/csrf-token')  // Endpoint that sets the XSRF-TOKEN cookie
      const csrfToken = nuxtApp.$csrf()
      if (csrfToken) {
        config.headers['X-XSRF-TOKEN'] = csrfToken
      }
    }
    return config
  })

  return {
    provide: {
      api
    }
  }
})
