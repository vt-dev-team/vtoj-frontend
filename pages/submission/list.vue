<script setup lang="ts">
import type { VSubmissionOutline } from '~/models/VSubmission';
import type { VResponse } from '~/models/VReponse';

const { t } = useI18n();

const settingsStore = useSettingsStore();

const route = useRoute();
const router = useRouter();

useHead({
    title: `${t('nav.status')} - ${settingsStore.website.title}`
})

const currentPage = ref(route.query.page ? parseInt(route.query.page as string) : 1);
const pageSize = ref(route.query.pageSize ? parseInt(route.query.pageSize as string) : 20);

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
        pageSize: pageSize.value
    }
    router.replace({ query });
    const res: VResponse<{ submissions: VSubmissionOutline[]; totalRecords: number; totalPages: number; pageSize: number; currentPage: number; }> = await $fetch('/api/submission/list', {
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
                            <tr>
                                <th>#</th>
                                <th>题目</th>
                                <th>递交者</th>
                                <th>结果</th>
                                <th>得分</th>
                                <th>递交时间</th>
                                <th>评测时间</th>
                                <th>评测机</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="submission in submissionData.submissions" :key="submission.id">
                                <td>{{ submission.id }}</td>
                                <td><problem-link :problem="submission.problem" /></td>
                                <td><user-link :user="submission.submitter" /></td>
                                <td>
                                    <router-link :to='`/submission/${submission.id}`' class="no-underline">
                                        <submission-result :result="submission.result" />
                                    </router-link>
                                </td>
                                <td>
                                    <router-link :to='`/submission/${submission.id}`' class="no-underline">
                                        <score-text :score="submission.score" />
                                    </router-link>
                                </td>
                                <td><date-text :date="submission.submitTime" /></td>
                                <td><date-text :date="submission.judgeTime" /></td>
                                <td>{{ submission.judgeMachine }}</td>
                            </tr>
                        </tbody>
                    </n-table>
                    <div class="v-pagination">
                        <n-pagination v-model:page="currentPage"
                            v-model:page-size="pageSize" :page-count="submissionData.totalPages"
                            show-size-picker :page-sizes="[10, 20, 30, 40]"
                            :on-update:page="updatePage"
                            :on-update:page-size="updatePageSize" />
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