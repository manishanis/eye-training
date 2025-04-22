// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // head title
  app: {
    head: {
      title: 'Game Title',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Game Description' },
      ],
    },
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
  ],
  // Runtime config allows passing variables to the Vue app
  runtimeConfig: {
    // Public values are exposed client-side
    public: {
      optionCount: 18, // Set the desired number of options (1 correct + n distractors)
      optionMoveIntervalSeconds: 1, // Interval for moving an option (in seconds)
      // totalRounds removed - now managed in Pinia store
      enableWarmup: false // Set to false to disable warmup rounds (default: true)
    }
  }
})
