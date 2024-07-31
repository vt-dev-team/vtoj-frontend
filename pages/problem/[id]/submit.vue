<script setup lang="ts">
import type { VResponse } from '~/models/VReponse';

const { t } = useI18n();

const settingsStore = useSettingsStore();

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
                message: t('base.success'),
                description: t('submission.submit_success'),
            });
            router.push(`/submission/${res.data.id}`);
        }
        else {
            notification.error({
                message: t('base.error'),
                description: res.error?.message || t('submission.submit_failed')
            });
        }
    }
    catch (e: any) {
        notification.error({
            message: t('base.error'),
            description: e.response?._data?.error?.message || t('submission.submit_failed')
        });
    }
    finally {
        submitting.value = false;
    }
}
</script>

<template>
    <two-column-layout>
        <template #left>
            <div class="v-card">
                <div class="v-card-title">提交代码</div>
                <a-space style="margin: 10px 0 20px 0;">
                    <a-select v-model:value="language" :options="languageOptions" :disabled="submitting"
                        style="width: 200px"></a-select>
                    <a-button type="primary" @click="submitAnswer">提交</a-button>
                </a-space>
                <div class="v-card-fix-body">
                    <LazyClientOnly>
                        <a-textarea v-model:value="code_content" :options="editorConfig"
                            :lang="languageList[language][1]" style="height: 400px"></a-textarea>
                    </LazyClientOnly>
                </div>
            </div>
        </template>
        <template #right>
            <div class="v-card">
                <div class="v-card-title-small">呃呃呃</div>
            </div>
        </template>
    </two-column-layout>
</template>