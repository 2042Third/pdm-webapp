// https://nuxt.com/docs/api/configuration/nuxt-config
import {resolve} from "path";
export default defineNuxtConfig({
  ssr: false,
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
  modules: [
    '@pinia/nuxt'
    , "@nuxt/ui"
  ],
})