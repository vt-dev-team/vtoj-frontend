<script setup lang="ts">
import { useSettingsStore } from '~/stores/settings';

const { website } = useSettingsStore();

const footer = ref();

let sout: NodeJS.Timeout | null = null;

function footerEnter(e: MouseEvent) {
    footer.value?.classList.add('v-footer-hover');
}

function footerLeave(e: MouseEvent) {
    if (sout) {
        clearTimeout(sout);
        sout = null;
    }
    sout = setTimeout(() => {
        footer.value?.classList.remove('v-footer-hover');
    }, 3000);
}

onMounted(() => {
    footer.value?.addEventListener('mouseenter', footerEnter);
    footer.value?.addEventListener('mouseleave', footerLeave);
});

onBeforeUnmount(() => {
    if (sout) {
        clearTimeout(sout);
        sout = null;
    }
    footer.value?.removeEventListener('mouseenter', footerEnter);
    footer.value?.removeEventListener('mouseleave', footerLeave);
});
</script>
<template>
    <div class="v-footer-height"></div>
    <div class="v-light"></div>
    <div class="v-footer" ref="footer">
        <div class="v-footer-logo">V</div>
        <div class="v-footer-content-2">{{ website.title }} Powered by <a href="https://github.com/vt-dev-team/vtoj" target="_blank">VTOJ</a>. Made by <a href="https://www.yemaster.cn" target="_blank">yemaster</a> with <span style="color: #db2828">❤</span></div>
    </div>
</template>