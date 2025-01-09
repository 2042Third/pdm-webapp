
export const useSecurity = () => {

  const salt =  () => {
    const nuxtApp = useNuxtApp();
    const { $config } = useNuxtApp()
    const salt = $config.public.salt || 'default-salt'

    // Collect browser information
    const screenRes = `${window.screen.width}x${window.screen.height}`
    const colorDepth = window.screen.colorDepth
    const timezoneOffset = new Date().getTimezoneOffset()
    const plugins = Array.from(navigator.plugins).map(p => p.name).join(',')
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    ctx.textBaseline = 'top'
    ctx.font = '14px Arial'
    ctx.textBaseline = 'alphabetic'
    ctx.fillStyle = '#f60'
    ctx.fillRect(125, 1, 62, 20)
    ctx.fillStyle = '#069'
    ctx.fillText('abcdefghijklmnopqrstuvwxyz', 2, 15)
    const canvasFingerprint = canvas.toDataURL()

    // Combine all collected data
    const rawFingerprint =  `${navigator.userAgent}|${screenRes}|${colorDepth}|${timezoneOffset}|${plugins}|${canvasFingerprint}`

    return nuxtApp.$wasm.get_hash(rawFingerprint + salt);

  }

  const createSecureContext = (a) => {
    const nuxtApp = useNuxtApp();
    const user = useUserStore();
    const ctx = nuxtApp.$wasm.create_context(a);
    console.log("createSecureContext = "+ ctx);
    user.setContextHandle(ctx);
  }

  return {salt, createSecureContext};
}
