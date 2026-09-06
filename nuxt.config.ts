import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxt/image'],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      htmlAttrs: {
        lang: 'fa',
        dir: 'rtl',
      },
      title: 'سارا رنجبر | آرایش صورت مینیمال در کرج',
      meta: [
        {
          name: 'description',
          content:
            'آرایش صورت مینیمال و مدرن در کرج — پوست تمیز، فرم طبیعی، بدون شلوغی. برای روز، ایونت و عروس.',
        },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#f7f5f2' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },

  runtimeConfig: {
    public: {
      whatsapp: process.env.NUXT_PUBLIC_WHATSAPP || '989381482799',
      instagram: process.env.NUXT_PUBLIC_INSTAGRAM || '__sararanjbar',
    },
  },

  image: {
    format: ['avif', 'webp'],
    quality: 80,
  },

  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: true,
    },
  },

  routeRules: {
    '/': { prerender: true },
  },
})
