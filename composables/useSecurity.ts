
export const useSecurity = () => {

  const salt =  () => {
    const nuxtApp = useNuxtApp();
    const { $config } = useNuxtApp()
    const salt = $config.public.salt || 'default-salt'

    // Collect browser information
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    ctx.textBaseline = 'top'
    ctx.font = '14px Arial'
    ctx.textBaseline = 'alphabetic'
    ctx.fillStyle = '#f60'
    ctx.fillRect(125, 1, 62, 20)
    ctx.fillStyle = '#069'
    ctx.fillText('abcdefghijklmnopqrstuvwxyz', 2, 15)

    // Combine all collected data
    const rawFingerprint = `${navigator.userAgent}|${getGPUInfo()}`

    return nuxtApp.$wasm.get_hash(rawFingerprint + salt);

  }

  const createSecureContext = (a) => {
    const nuxtApp = useNuxtApp();
    const user = useUserStore();
    const ctx = nuxtApp.$wasm.create_context(a);
    console.log("createSecureContext = "+ ctx);
    user.setContextHandle(ctx);
  }

  const getGPUInfo = () => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')

      if (!gl) return {}

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
      if (!debugInfo) return {}

      // Only get the vendor and renderer - these are hardware-specific
      return {
        gpuVendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
        gpuRenderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      }
    } catch (e) {
      console.warn('GPU fingerprinting failed:', e)
      return {}
    }
  }

  function theFingerprint() {
    // Only use the most stable hardware characteristics
    const components = {
      // CPU/Platform info - these don't change with system state
      platform: navigator.platform,
      hardwareConcurrency: navigator.hardwareConcurrency,

      // GPU info - only vendor and renderer, which are hardware-specific
      ...getGPUInfo()
    }

    const fingerprint = Object.entries(components)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}:${value}`)
      .sort()
      .join('|')
    return fingerprint;
  }

  return {
    salt,
    createSecureContext,
    theFingerprint,
  };
}
