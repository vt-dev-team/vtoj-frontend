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

const columns = [
    {
        title: '#',
        key: 'id',
        dataIndex: 'id',
    },
    {
        title: '递交者',
        key: 'submitter',
        dataIndex: 'submitter'
    },
    {
        title: '题目',
        key: 'problem',
        dataIndex: 'problem'
    },
    {
        title: '结果',
        key: 'result',
        dataIndex: 'result'
    },
    {
        title: '得分',
        key: 'score',
        dataIndex: 'score'
    },
    {
        title: '更新时间',
        key: 'judgeTime',
        dataIndex: 'judgeTime'
    },
    {
        title: '评测机',
        key: 'judgeMachine',
        dataIndex: 'judgeMachine'
    }
]

const { status, data: submissionData, error } = useLazyAsyncData('submission-list', async () => {
    const query = {
        page: currentPage.value
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
    <two-column-layout>
        <template #left>
            <div class="v-card">
                <div class="v-card-title">评测队列</div>
                <template v-if="status !== 'success' || !submissionData">
                    <a-skeleton active />
                </template>
                <div class="v-card-fix-body" v-else>
                    <a-table :columns="columns" :data-source="submissionData.data"
                        :pagination="false" size="small">
                        <template #bodyCell="{ column, record }">
                            <template v-if="column.key === 'id'">
                                {{ record.id }}
                            </template>
                            <template v-else-if="column.key === 'submitter'">
                                <user-link :user="record.submitter" />
                            </template>
                            <template v-else-if="column.key === 'problem'">
                                <problem-link :problem="record.problem" />
                            </template>
                            <template v-else-if="column.key === 'result'">
                                <router-link :to="'/submission/' + record.id">
                                    <submission-result :result="record.result" />
                                </router-link>
                            </template>
                            <template v-else-if="column.key === 'score'">
                                <router-link :to="'/submission/' + record.id">
                                    <score-text :score="record.score" />
                                </router-link>
                            </template>
                            <template v-else-if="column.key === 'judgeTime'">
                                <date-text :date="record.judgeTime" />
                            </template>
                        </template>
                    </a-table>
                    <div class="v-pagination">
                        <a-pagination v-model:current="currentPage" v-model:page-size="pageSize"
                            :total="submissionData.totalRecords" />
                    </div>
                </div>
            </div>
        </template>
        <template #right>
            <div class="v-card">
                <div class="v-card-title-small">筛选</div>

            </div>
        </template>
    </two-column-layout>
</template>