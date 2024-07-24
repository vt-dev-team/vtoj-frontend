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
const timeSetter = setInterval(() => {
    nowTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss');
}, 1000);
// 在离开页面后需要销毁
onUnmounted(() => {
    clearInterval(timeSetter);
});

</script>

<template>
    <n-grid cols="4" :x-gap="20" :y-gap="12" item-responsive responsive="screen">
        <n-grid-item span="4 l:3">
            <div class="v-card">
                <div class="v-card-title">比赛列表</div>
            </div>
        </n-grid-item>
        <n-grid-item span="4 l:1">
            <div class="v-card">
                <div class="v-card-title-small">当前时间</div>
                {{ nowTime }}
            </div>
        </n-grid-item>
    </n-grid>
</template>