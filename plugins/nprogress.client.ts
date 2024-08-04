import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

export default defineNuxtPlugin(nuxtApp => {
    useRouter().beforeEach(() => {
        NProgress.start();
    });

    useRouter().afterEach(() => {
        NProgress.done();
    });
})