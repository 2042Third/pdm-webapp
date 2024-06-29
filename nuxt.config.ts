// https://nuxt.com/docs/api/configuration/nuxt-config
import {resolve} from "path";
export default defineNuxtConfig({
  ssr: true,
  devServer: {
    host: '0.0.0.0',
    port: 3000
  },
  router: {
    base: '/webapp/'
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
    {src:'~/plugins/wasm', mode: 'client'},
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
    '@pinia/nuxt'
    , "@nuxt/ui"
  ],

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
