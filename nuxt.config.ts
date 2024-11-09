// https://nuxt.com/docs/api/configuration/nuxt-config
import {resolve} from "path";
export default defineNuxtConfig({
  vite: {
    define: {
      'process.env.DEBUG': 'true',
    },
  },
  // compatibilityDate: '2024-11-08',
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
      apiBase: process.env.API_BASE || 'http://10.0.0.44/api',
      wsBase: process.env.WS_BASE || 'ws://10.0.0.44',
      apiProduction: process.env.API_PRODUCTION || 'https://pdm.pw',
      wsProduction: process.env.WS_PRODUCTION || 'wss://pdm.pw',
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
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  plugins: [
    // {src:'~/plugins/wasm', mode: 'client'},
    {src:'~/plugins/wasm'},
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
      const fs = require('fs').promises;
      const path = require('path');

      const sourceFile = path.join(generator.nuxt.options.buildDir, 'public/wasm/notes.wasm');
      const destinationFile = path.join(generator.nuxt.options.buildDir, 'server/notes.wasm');

      await fs.copyFile(sourceFile, destinationFile);
      console.log('Copied notes.wasm to server directory');
    },
  },
})
