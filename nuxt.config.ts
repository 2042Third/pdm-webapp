// https://nuxt.com/docs/api/configuration/nuxt-config
import {resolve} from "path";
export default defineNuxtConfig({
  vite: {
    devtools: false,
    define: {
      'process.env.DEBUG': 'false',
      // 'process.env.DEBUG': 'true',
    },
    plugins: [
      {
        name: 'wasm-fix',
        enforce: 'pre',
        transform(code, id) {
          if (id.endsWith('.wasm')) {
            return `export default "${id}";`;
          }
        }
      }
    ]
  },
  devtools: false,
  compatibilityDate: '2024-11-08',
  ssr: true,

  devServer: {
    host: '0.0.0.0',
    port: 3000
  },

  router: {
    base: '/webapp/'
  },

  runtimeConfig: {
    public: {
      salt: process.env.NUXT_SALT,
      apiBase: process.env.API_BASE || 'http://0.0.0.0/api',
      wsBase: process.env.WS_BASE || 'ws://0.0.0.0',
      turnstileSiteKey: process.env.NUXT_PUBLIC_CF_TURNSTILE_SITE_KEY || '1x00000000000000000000AA',
      apiProduction: (() => {
        console.log('NUXT_PUBLIC_PDM_BASE_URL:', process.env.NUXT_PUBLIC_PDM_BASE_URL);
        return process.env.NUXT_PUBLIC_PDM_BASE_URL || 'https://yangyi.dev';
      })(),
      wsProduction: process.env.NUXT_PUBLIC_PDM_BASE_WS_URL || 'wss://yangyi.dev',
      isProd: process.env.NODE_ENV === 'production',
    }
  },

  alias: {
    "@": resolve(__dirname, "/"),
  },

  css:[
    '~/assets/main.scss',
  ],

  devtools: {
    enabled: false,

    timeline: {
      enabled: true,
    },
  },

  plugins: [
    {src:'~/plugins/wasm', mode: 'client'},
    // {src:'~/plugins/wasm'},
  ],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  modules: [
    '@pinia/nuxt',
    "@nuxt/ui",
    "@nuxt/image",
    '@pinia-plugin-persistedstate/nuxt',
    '@formkit/auto-animate/nuxt',
  ],

  piniaPersistedstate: {
    cookieOptions: {
      sameSite: 'strict',
    },
    storage: 'localStorage'
  },
  hooks: {
    'build:compiled': async (generator) => {
      if (process.env.NODE_ENV === 'production') {
        const fs = require('fs').promises;
        const path = require('path');

        const sourceFile = path.join(generator.nuxt.options.buildDir, 'public/wasm/notes.wasm');
        const destinationFile = path.join(generator.nuxt.options.buildDir, 'server/notes.wasm');

        await fs.copyFile(sourceFile, destinationFile);
        console.log('Copied notes.wasm to server directory');
      }
    },
  },

  compatibilityDate: '2024-11-09',
})
