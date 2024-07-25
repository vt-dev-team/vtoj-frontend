<script setup lang="ts">
import type { VSubmissionOutline } from '~/models/VSubmission';
import type { VResponse } from '~/models/VReponse';
import type { VArray } from '~/models/VArray';

const { t } = useI18n();

const settingsStore = useSettingsStore();

const route = useRoute();
const router = useRouter();

useHead({
    title: `${t('nav.status')} - ${settingsStore.website.title}`
})

const currentPage = ref(route.query.page ? parseInt(route.query.page as string) : 1);
const pageSize = ref(route.query.pageSize ? parseInt(route.query.pageSize as string) : 10);

const updatePage = (page: number) => {
    currentPage.value = page;
}

const updatePageSize = (nPageSize: number) => {
    currentPage.value = 1;
    pageSize.value = nPageSize;
}

const { status, data: submissionData, error } = useLazyAsyncData('submission-list', async () => {
    const query = {
        page: currentPage.value,
        //pageSize: pageSize.value
    }
    router.replace({ query });
    const res: VResponse<VArray<VSubmissionOutline>> = await $fetch('/api/submission/list', {
        params: query
    })
    if (res.status === 'success') {
        return res.data;
    }
    else {
        throw new Error(res.error?.message || t('error'));
    }
}, {
    watch: [currentPage, pageSize]
});

if (error.value) {
    router.push({ name: 'error', query: { code: (error.value as any)?.statusCode || 500, title: 'error.unable_to_connect_server', message: error.value?.message || '' } });
}
</script>

<template>
    <n-grid cols="4" :x-gap="20" :y-gap="12" item-responsive responsive="screen">
        <n-grid-item span="4 l:3">
            <div class="v-card">
                <div class="v-card-title">评测队列</div>
                <template v-if="status !== 'success' || !submissionData">
                    <n-skeleton text :repeat="2" /> <n-skeleton text style="width: 60%" />
                </template>
                <div class="v-card-fix-body" v-else>
                    <n-table size="small">
                        <thead>
                            <tr class="v-submission-list__header">
                                <th class="v-submission-list__id">#</th>
                                <th class="v-submission-list__submitter">递交者</th>
                                <th class="v-submission-list__problem">题目</th>
                                <th class="v-submission-list__result">结果</th>
                                <th class="v-submission-list__score">得分</th>
                                <th class="v-submission-list__update-time">更新时间</th>
                                <th class="v-submission-list__judger">评测机</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="submission in submissionData.data" :key="submission.id">
                                <td class="v-submission-list__id">{{ submission.id }}</td>
                                <td class="v-submission-list__submitter"><user-link :user="submission.submitter" /></td>
                                <td class="v-submission-list__problem"><problem-link :problem="submission.problem" /></td>
                                <td class="v-submission-list__result">
                                    <router-link :to='`/submission/${submission.id}`' class="no-underline">
                                        <submission-result :result="submission.result" />
                                    </router-link>
                                </td>
                                <td class="v-submission-list__score">
                                    <router-link :to='`/submission/${submission.id}`' class="no-underline">
                                        <score-text :score="submission.score" />
                                    </router-link>
                                </td>
                                <td class="v-submission-list__update-time"><date-text :date="submission.judgeTime" /></td>
                                <td class="v-submission-list__judger">{{ submission.judgeMachine }}</td>
                            </tr>
                        </tbody>
                    </n-table>
                    <div class="v-pagination">
                        <n-pagination v-model:page="currentPage"
                            v-model:page-size="pageSize" :page-count="submissionData.totalPages" />
                    </div>
                </div>
            </div>
        </n-grid-item>
        <n-grid-item span="4 l:1">
            <div class="v-card">
                <div class="v-card-title-small">筛选</div>

            </div>
        </n-grid-item>
    </n-grid>
</template>