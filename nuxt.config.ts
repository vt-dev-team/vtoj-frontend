// https://nuxt.com/docs/api/configuration/nuxt-config
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import prismjs from 'vite-plugin-prismjs';

export default defineNuxtConfig({
  css: [
    'vfonts/Lato.css',
    'vfonts/FiraCode.css',
    '~/assets/scss/vtoj.scss'
  ],
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ["nuxtjs-naive-ui", '@pinia/nuxt', '@nuxtjs/i18n'],
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
      }),
      AutoImport({
        imports: [
          {
            'naive-ui': [
              'useDialog',
              'useMessage',
              'useNotification',
              'useLoadingBar'
            ]
          }
        ]
      }),
      Components({
        resolvers: [NaiveUiResolver()]
      })
    ]
  }
})