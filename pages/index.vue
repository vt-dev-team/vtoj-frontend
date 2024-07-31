<script setup lang="ts">
import type { VProblemOutline, VProblemSearchParam } from '~/models/VProblem';
import type { VResponse } from '~/models/VReponse';

const { t } = useI18n();

const settingsStore = useSettingsStore();

const route = useRoute();
const router = useRouter();

useHead({
    title: `${t('nav.home')} - ${settingsStore.website.title}`
})
</script>

<template>
    <two-column-layout>
        <template #left>
            <div class="v-card">
                <div class="v-card-title-small">公告信息</div>
            </div>
            <div class="v-card">
                <div class="v-card-title-small">近期比赛</div>
            </div>
        </template>
        <template #right>
            <div class="v-card">
                <div class="v-card-title-small">最近更新</div>
            </div>
        </template>
    </two-column-layout>
</template>