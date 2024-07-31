<script setup lang="ts">
import type { VResponse } from '~/models/VReponse';

const { t } = useI18n();

const settingsStore = useSettingsStore();

const route = useRoute();
const router = useRouter();

useHead({
    title: `${t('nav.contest')} - ${settingsStore.website.title}`
})

const dayjs = useDayjs();

const nowTime = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'));
// 设置一个Interval，每秒更新一次时间
let timeSetter: NodeJS.Timeout;
onNuxtReady(() => {
    timeSetter = setInterval(() => {
        nowTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss');
    }, 1000);
})
// 在离开页面后需要销毁
onUnmounted(() => {
    clearInterval(timeSetter);
});

</script>

<template>
    <two-column-layout>
        <template #left>
            <div class="v-card">
                <div class="v-card-title">比赛列表</div>
            </div>
        </template>
        <template #right>
            <div class="v-card">
                <div class="v-card-title-small">当前时间</div>
                {{ nowTime }}
            </div>
        </template>
    </two-column-layout>
</template>