<script setup lang="ts">
import type { VResponse } from '~/models/VReponse';
import type { VSubmission } from '~/models/VSubmission';

import Prism from 'prismjs';

const { t } = useI18n();

const settingsStore = useSettingsStore();

const route = useRoute();
const router = useRouter();

const submissionId = route.params.id;

useHead({
    title: `提交记录详情#${submissionId} - ${settingsStore.website.title}`
})

const languageList = [['C', 'c'], ['C++', 'cpp'], ['Python', 'python'], ['Java', 'java'], ['Pascal', 'pascal'], ['JavaScript', 'javascript']];

const statusCode = [
    ['Pending', 'blue'],
    ['Pending Rejudge', 'blue'],
    ['Judging', 'blue'],
    ['Accepted', 'green'],
    ['Wrong Answer', 'red'],
    ['Time Limit Exceeded', 'yellow'],
    ['Memory Limit Exceeded', 'purple'],
    ['Output Limit Exceeded', 'red'],
    ['Runtime Error', 'red'],
    ['Unknown Error', 'red'],
    ['System Error', 'red'],
    ['Unaccepted', 'red']
]

const isJudging = ref(true); // 是否正在评测

const { status, data: submissionInfo, error, refresh } = useLazyAsyncData(`submission-info-${submissionId}`, async () => {
    const res: VResponse<VSubmission> = await $fetch(`/api/submission/${submissionId}`)
    if (res.status === 'success') {
        res.data.codeText = Prism.highlight(res.data.codeText, Prism.languages[languageList[res.data.language][1]], languageList[res.data.language][1]);
        return res.data;
    }
    else {
        throw new Error(res.error?.message || t('error'));
    }
});

function refreshData() {
    refresh();
}

if (error.value) {
    console.log(error.value)
}

onMounted(async () => {
    await nextTick();
    Prism.highlightAll();
})
</script>
<template>
    <two-column-layout>
        <template #left>
            <div class="v-card">
                <a-result v-if="status === 'error'" status="error" title="出错了" :sub-title="error?.message">
                    <template #extra>
                        <a-button type="primary" @click="refreshData">重试</a-button>
                    </template>
                </a-result>
                <template v-else-if="status !== 'success' || !submissionInfo">
                    <a-skeleton active />
                </template>
                <template v-else>
                    <div class="v-card-title">
                        <submission-result :result="submissionInfo.result" />
                    </div>
                    <a-progress type="line" :percent="60" :format="(p?: number) => `${p}分`" />
                    <a-divider />
                    编译器信息
                    <a-divider />
                    测试点信息，(/)
                    <a-divider />
                    <pre class="v-code"><code v-html="submissionInfo.codeText"></code></pre>

                </template>
            </div>
        </template>
    </two-column-layout>
</template>