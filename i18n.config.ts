import zhCN from '~/locales/zh-CN.json';
import enUS from '~/locales/en-US.json';

export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'zh-CN',
    messages: {
        'zh-CN': zhCN,
        'en-US': enUS
    }
}));