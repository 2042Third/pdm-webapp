// https://nuxt.com/docs/api/configuration/nuxt-config
import {resolve} from "path";
export default defineNuxtConfig({
  alias: {
    "@": resolve(__dirname, "/"),
  },
  css:[
    '~/assets/main.scss',
  ],
  devtools: { enabled: true },
  plugins: ['~/plugins/wasm'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },
})
