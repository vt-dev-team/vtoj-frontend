<script setup lang="ts">
import { useNotification } from 'naive-ui';
import { HourglassOutline } from '@vicons/ionicons5';

import type { VResponse } from '~/models/VReponse';
import type { VSubmission } from '~/models/VSubmission';

import Prism from 'prismjs';

const { t } = useI18n();

const settingsStore = useSettingsStore();

const notification = useNotification();
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

if (error.value) {
    console.log(error.value)
}

onMounted(async () => {
    await nextTick();
    Prism.highlightAll();
})
</script>
<template>
    <n-grid cols="4" :x-gap="20" :y-gap="12" item-responsive responsive="screen">
        <n-grid-item span="4 l:3">
            <div class="v-card">
                <n-result v-if="status === 'error'" status="error" title="出错了" :description="error?.message">
                    <template #footer>
                        <n-button @click="refresh">重试</n-button>
                    </template>
                </n-result>
                <template v-else-if="status !== 'success' || !submissionInfo">
                    <n-skeleton :width="146" :sharp="false" size="medium" />
                    <n-skeleton text :repeat="2" /> <n-skeleton text style="width: 60%" />
                </template>
                <template v-else>
                    <div class="v-card-title">
                        <span class="v-result" :class="statusCode[submissionInfo.result][1]">
                            <n-icon>
                                <HourglassOutline />
                            </n-icon>{{ statusCode[submissionInfo.result][0] }}
                        </span>
                    </div>
                    <n-progress type="line" :percentage="60" :show-indicator="false" :processing="isJudging" :border-radius="4"
                        :fill-border-radius="0" />
                    <n-divider />
                    编译器信息
                    <n-divider />
                    测试点信息，(/)
                    <n-divider />
                    <pre><code v-html="submissionInfo.codeText"></code></pre>

                </template>
            </div>
        </n-grid-item>
    </n-grid>
</template>