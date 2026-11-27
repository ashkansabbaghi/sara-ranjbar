import tailwindcss from '@tailwindcss/vite'
import { injectCsp } from './config/csp'

const rawBase = process.env.NUXT_APP_BASE_URL || '/'
const baseURL = rawBase.endsWith('/') ? rawBase : `${rawBase}/`

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
    baseURL,
    head: {
      htmlAttrs: {
        lang: 'fa',
        dir: 'rtl',
      },
      // The home page sets its own title and description from the page texts (studio panel).
      title: 'سارا رنجبر',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#f7f5f2' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: `${baseURL}favicon.svg` }],
    },
  },

  runtimeConfig: {
    public: {
      siteUrl: (
        process.env.NUXT_PUBLIC_SITE_URL || 'https://ashkansabbaghi.github.io/sara-ranjbar'
      ).replace(/\/+$/, ''),
      whatsapp: process.env.NUXT_PUBLIC_WHATSAPP || '989381482799',
      instagram: process.env.NUXT_PUBLIC_INSTAGRAM || '__sararanjbar',
      phone: process.env.NUXT_PUBLIC_PHONE || '989381482799',
      telegram: process.env.NUXT_PUBLIC_TELEGRAM || '',
      contentRepo: process.env.NUXT_PUBLIC_CONTENT_REPO || 'ashkansabbaghi/sara-ranjbar-content',
    },
  },

  image: {
    format: ['webp'],
    quality: 80,
  },

  nitro: {
    prerender: {
      routes: ['/', '/studio', '/robots.txt', '/sitemap.xml'],
      crawlLinks: true,
    },
  },

  routeRules: {
    '/': { prerender: true },
  },

  hooks: {
    'nitro:init'(nitro) {
      nitro.hooks.hook('prerender:generate', (route) => {
        if (route.fileName?.endsWith('.html') && typeof route.contents === 'string') {
          route.contents = injectCsp(route.contents)
        }
      })
    },
  },
})
