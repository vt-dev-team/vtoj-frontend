<script setup lang="ts">
import { useNotification } from 'naive-ui';

import type { VResponse } from '~/models/VReponse';
import type { VUserInfo } from '~/models/VUser';

const { t } = useI18n();

const settingsStore = useSettingsStore();

const notification = useNotification();
const route = useRoute();
const router = useRouter();

useHead({
    title: `提交代码 - ${settingsStore.website.title}`
})

const editorConfig = {
    theme: 'tomorrow'
}

const languageList = [['C', 'c'], ['C++', 'cpp'], ['Python', 'python'], ['Java', 'java'], ['Pascal', 'pascal'], ['JavaScript', 'javascript']];
const languageOptions: { label: string, value: string | number }[] = []

for (let i = 0; i < languageList.length; i++) {
    languageOptions.push({
        label: languageList[i][0],
        value: i
    })
}

const problemId = route.params.id;
const contestId = route.query.contest;

const code_content = ref();
const language = ref(0);

const submitting = ref(false);

async function submitAnswer() {
    if (submitting.value) return;
    submitting.value = true;
    try {
        const res: VResponse<{ id: number }> = await $fetch('/api/submission/submit', {
            method: 'post',
            body: JSON.stringify({
                language: language.value,
                code: code_content.value,
                problem: problemId,
                contest: contestId,
            })
        });
        if (res.status === 'success') {
            notification.success({
                title: t('base.success'),
                content: t('submission.submit_success'),
                duration: 2500,
                keepAliveOnHover: true
            });
            router.push(`/submission/${res.data.id}`);
        }
        else {
            notification.error({
                title: t('base.error'),
                content: res.error?.message || t('submission.submit_failed'),
                duration: 2500,
                keepAliveOnHover: true
            });
        }
    }
    catch (e: any) {
        notification.error({
            title: t('base.error'),
            content: e.response?._data?.error?.message || t('submission.submit_failed'),
            duration: 2500,
            keepAliveOnHover: true
        });
    }
    finally {
        submitting.value = false;
    }
}
</script>

<template>
    <n-grid cols="4" :x-gap="20" :y-gap="12" item-responsive responsive="screen">
        <n-grid-item span="4 l:3">
            <div class="v-card">
                <div class="v-card-title">提交代码</div>
                <n-space style="margin: 10px 0;">
                    <n-select v-model:value="language" :options="languageOptions" :disabled="submitting" size="small"
                        style="width: 250px"></n-select>
                    <n-button type="info" size="small" @click="submitAnswer">提交</n-button>
                </n-space>
                <div class="v-card-fix-body">
                    <LazyClientOnly>
                        <n-input type="textarea" v-model:value="code_content" :options="editorConfig"
                            :lang="languageList[language][1]" style="height: 400px"></n-input>
                    </LazyClientOnly>
                </div>
            </div>
        </n-grid-item>
        <n-grid-item span="4 l:1">
            <div class="v-card">
                <div class="v-card-title-small">呃呃呃</div>
            </div>
        </n-grid-item>
    </n-grid>
</template>