export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: [
    '@pinia/nuxt',
    '@nuxt/ui'
  ],
  runtimeConfig: {
    public: {
      VUE_APP_NODE_ENV: process.env.VUE_APP_NODE_ENV,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      SECRET_KEY: process.env.SECRET_KEY,
      HASHED_SECRET_KEY: process.env.HASHED_SECRET_KEY,
    }
  },
})
