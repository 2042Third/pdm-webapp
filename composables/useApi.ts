import { useCookie, useNuxtApp } from '#app'

export function useApi() {
  const { $csrf } = useNuxtApp()
  const {sessionKey} = useUserStore()  // Assuming you store the session key in a cookie

  const api = $fetch.create({
    headers: {
      "Authorization": "Bearer " + sessionKey || '',
      'X-XSRF-TOKEN': $csrf() || '',
    },
    credentials: 'include',  // This ensures cookies are sent with the request
  })

  return {
    get: (url: string) => api(url, { method: 'GET' }),
    post: (url: string, body: any) => api(url, {
      method: 'POST',
      body,
    }),
    // Add other methods as needed
  }
}
