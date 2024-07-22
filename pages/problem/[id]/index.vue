<script setup lang="ts">
// TODO: 加载状态，还有SSR好像没管用
import type { VProblem } from '~/models/VProblem';
import type { VResponse } from '~/models/VReponse';

import { ServerOutline, TimeOutline } from '@vicons/ionicons5';

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
        res.data.description = marked.parse(res.data.description) as string;
        return res.data;
    }
    else {
        throw new Error(res.error?.message || t('error'));
    }
});

if (error.value) {
    router.push({ name: 'error', query: { code: (error.value as any)?.statusCode || 500, title: 'error.unable_to_connect_server', message: error.value?.message || '' } });
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
    <n-grid cols="4" :x-gap="20" :y-gap="12" item-responsive responsive="screen">
        <n-grid-item span="4 l:3">
            <div class="v-card">
                <template v-if="status !== 'success' || !problemInfo">
                    <n-skeleton :width="146" :sharp="false" size="medium" />
                    <n-skeleton text :repeat="2" /> <n-skeleton text style="width: 60%" />
                </template>
                <template v-else>
                    <div class="v-card-title">{{ problemInfo.pid }}. {{ problemInfo.title }}</div>
                    <n-space>
                        <n-tag :bordered="false" type="warning">
                            {{ problemInfo.timeLimit }}ms
                            <template #icon>
                                <n-icon>
                                    <TimeOutline />
                                </n-icon>
                            </template>
                        </n-tag>
                        <n-tag :bordered="false" type="info">
                            {{ problemInfo.memoryLimit }}MB
                            <template #icon>
                                <n-icon>
                                    <ServerOutline />
                                </n-icon>
                            </template>
                        </n-tag>
                        <n-tag :bordered="false">{{ t(problemType[problemInfo.judgeMethod]) }}</n-tag>
                    </n-space>
                    <n-divider />
                    <div class="v-problem-info" v-html="problemInfo.description"></div>
                </template>
            </div>
        </n-grid-item>
        <n-grid-item span="4 l:1">
            <div class="v-card">
                <div class="v-card-fix-body" style="margin-top: -16px">
                    <n-list hoverable clickable>
                        <template v-if="loginUserStore.login">
                            <n-list-item @click="$router.push(`/problem/${problemId}/submit`)">
                                提交代码
                            </n-list-item>
                            <n-list-item>
                                解题记录
                            </n-list-item>
                            <!--有管理权限-->
                            <template v-if="true">

                            </template>
                        </template>
                        <template v-else>
                            <n-list-item @click="$router.push('/user/login')">
                                登录后提交
                            </n-list-item>
                        </template>
                    </n-list>
                </div>
            </div>
        </n-grid-item>
    </n-grid>
</template>