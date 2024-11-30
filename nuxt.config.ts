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
    host: '127.0.0.1',
    port: 3000
  },

  router: {
    base: '/webapp/'
  },

  runtimeConfig: {
    public: {
      salt: process.env.NUXT_SALT,
      apiBase: process.env.API_BASE || 'http://127.0.0.1/api',
      wsBase: process.env.WS_BASE || 'ws://127.0.0.1',
      apiProduction: process.env.API_PRODUCTION || 'https://yangyi.dev',
      wsProduction: process.env.WS_PRODUCTION || 'wss://yangyi.dev',
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

  // hooks: {
  //   'build:compiled': async (generator) => {
  //     const fs = require('fs').promises;
  //     const path = require('path');
  //
  //     const sourceFile = path.join(generator.nuxt.options.buildDir, 'public/wasm/notes.wasm');
  //     const destinationFile = path.join(generator.nuxt.options.buildDir, 'server/notes.wasm');
  //
  //     await fs.copyFile(sourceFile, destinationFile);
  //     console.log('Copied notes.wasm to server directory');
  //   },
  // },
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
