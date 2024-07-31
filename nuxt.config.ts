// https://nuxt.com/docs/api/configuration/nuxt-config
import prismjs from 'vite-plugin-prismjs';

export default defineNuxtConfig({
  css: [
    'vfonts/Lato.css',
    'vfonts/FiraCode.css',
    '~/assets/scss/vtoj.scss'
  ],
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    'dayjs-nuxt',
    '@nuxtjs/i18n',
    "@ant-design-vue/nuxt"
  ],
  antd: {

  },
  dayjs: {
    locales: ['en', 'zh-cn'],
    plugins: ['relativeTime', 'utc', 'timezone'],
    defaultLocale: 'zh-cn',
    defaultTimezone: 'Asia/Shanghai',
  },
  i18n: {
    vueI18n: './i18n.config.ts'
  },
  nitro: {
    routeRules: {
      "/api/**": { proxy: 'http://localhost:8080/api/**' },
    }
  },
  vite: {
    plugins: [
      prismjs({
        languages: ['cpp',
          'c',
          'java',
          'python',
          'javascript'
        ],
        plugins: ['line-numbers'],
        theme: 'tomorrow',
        css: true
      })
    ],
    ssr: {
      noExternal: ['naive-ui']
    }
  }
})