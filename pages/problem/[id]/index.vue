<script setup lang="ts">
// TODO: 加载状态，还有SSR好像没管用
import type { VProblem } from '~/models/VProblem';
import { VFetchError, type VResponse } from '~/models/VReponse';

import { marked } from 'marked';

const { t } = useI18n();

const settingsStore = useSettingsStore();
const loginUserStore = useLoginUserStore();

const route = useRoute();
const router = useRouter();

const problemId = route.params.id;

const problemType = ['problem.normal_judge', 'problem.special_judge', 'problem.submit_answer', 'problem.interactive_judge']

const { status, data: problemInfo, error } = useLazyAsyncData(`problem-info-${problemId}`, async () => {
    const res: VResponse<VProblem> = await $fetch(`/api/problem/${problemId}`)
    if (res.status === 'success') {
        if (res.data === null) {
            throw new VFetchError(404, t('error.problem_not_found'));
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

watch(problemInfo, (newProblemInfo) => {
    if (newProblemInfo) {
        useHead({
            title: `${newProblemInfo.pid}. ${newProblemInfo.title} - ${settingsStore.website.title}`
        })
    }
})
</script>

<template>
    <two-column-layout>
        <template #left>
            <div class="v-card">
                <template v-if="status !== 'success' || !problemInfo">
                    <a-skeleton active />
                </template>
                <template v-else>
                    <div class="v-card-title">{{ problemInfo.pid }}. {{ problemInfo.title }}</div>
                    <div>
                        <a-tooltip trigger="hover">
                            <template #title>
                                <span>时间限制</span>
                            </template>
                            <span>
                                <a-tag color="orange">
                                    <template #icon>
                                        <ClockCircleOutlined />
                                    </template>
                                    {{ problemInfo.timeLimit }}ms
                                </a-tag>
                            </span>
                        </a-tooltip>
                        <a-tooltip trigger="hover">
                            <template #title>
                                <span>空间限制</span>
                            </template>
                            <span>
                                <a-tag color="purple">
                                    <template #icon>
                                        <DatabaseOutlined />
                                    </template>
                                    {{ problemInfo.memoryLimit }}MB
                                </a-tag>
                            </span>
                        </a-tooltip>
                        <a-tag>{{ t(problemType[problemInfo.judgeMethod]) }}</a-tag>
                    </div>
                    <a-divider />
                    <div class="v-problem-info" v-html="problemInfo.description"></div>
                </template>
            </div>
        </template>
        <template #right>
            <div class="v-card">
                <div class="v-card-fix-body" style="margin-top: -16px">
                    <div class="v-list v-list-hover">
                        <template v-if="loginUserStore.login">
                            <div class="v-list-item" @click="$router.push(`/problem/${problemId}/submit`)">
                                提交代码
                            </div>
                            <div class="v-list-item">
                                解题记录
                            </div>
                            <!--有管理权限-->
                            <template v-if="true">

                            </template>
                        </template>
                        <template v-else>
                            <div class="v-list-item" @click="$router.push('/user/login')">
                                登录后提交
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </template>
    </two-column-layout>
</template>