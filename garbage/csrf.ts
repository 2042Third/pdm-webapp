// plugins/csrf.ts
export default defineNuxtPlugin((nuxtApp) => {
  const getCsrfToken = () => {
    if (import.meta.client) {
      const cookies = document.cookie.split(';')
      const xsrfCookie = cookies.find(cookie => cookie.trim().startsWith('XSRF-TOKEN='))
      return xsrfCookie ? xsrfCookie.split('=')[1] : null
    }
    return null
  }

  return {
    provide: {
      csrf: getCsrfToken
    }
  }
})
