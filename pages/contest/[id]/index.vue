<script setup lang="ts">
import type { VContestBasicInfo } from '~/models/VContest';
import { VFetchError, type VResponse } from '~/models/VReponse';

import { marked } from 'marked';

const { t } = useI18n();

const settingsStore = useSettingsStore();
const loginUserStore = useLoginUserStore();

const route = useRoute();
const router = useRouter();

const contestId = route.params.id;

const { status, data: contestInfo, error } = useLazyAsyncData(`contest-info-${contestId}`, async () => {
    const res: VResponse<VContestBasicInfo> = await $fetch(`/api/contest/${contestId}`)
    if (res.status === 'success') {
        if (res.data === null) {
            throw new VFetchError(404, t('error.contest_not_found'));
        }
        res.data.description = marked.parse(res.data.description) as string;
        return res.data;
    }
    else {
        throw new VFetchError(res.error.code, res.error?.message || t('error'));
    }
});

if (error.value) {
    router.push({ name: 'error', query: { code: (error.value as any)?.code || 500, title: 'error.unable_to_connect_server', message: error.value?.message || '' } });
}

watch(contestInfo, (newContestInfo) => {
    if (newContestInfo) {
        useHead({
            title: `${t('nav.contest')}${newContestInfo.id}. ${newContestInfo.title} - ${settingsStore.website.title}`
        })
    }
})
</script>

<template>
    <two-column-layout>
        <template #left>
            <div class="v-card">
                <template v-if="status !== 'success' || !contestInfo">
                    <a-skeleton active />
                </template>
                <template v-else>
                    <div class="v-card-title">{{ $t('nav.contest') }}{{ contestInfo.id }}. {{ contestInfo.title }}</div>
                    <a-divider />
                    <div class="v-problem-info" v-html="contestInfo.description"></div>
                </template>
            </div>
        </template>
        <template #right>
            <div class="v-card">
                <div class="v-card-fix-body" style="margin-top: -16px">
                    <div class="v-list v-list-hover">
                        <div class="v-list-item">比赛信息</div>
                        <!-- 还未参赛，并且比赛还未开始，就可以报名-->
                        <template v-if="true">
                            <div class="v-list-item">报名比赛</div>
                        </template>
                    </div>
                </div>
            </div>
        </template>
    </two-column-layout>
</template>