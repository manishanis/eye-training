// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  target: 'static',
  app: {
    baseURL: '/eye-training/', // Important for GitHub Pages
    head: {
      title: 'Game Title',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Game Description' },
      ],
    },
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: [
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/tailwindcss',
  ],
  plugins: [
    '~/plugins/pinia.ts',
  ],
  // Runtime config allows passing variables to the Vue app
  runtimeConfig: {
    // Public values are exposed client-side
    public: {
      enableWarmup: false // Set to false to disable warmup rounds (default: true)
    }
  },
})
