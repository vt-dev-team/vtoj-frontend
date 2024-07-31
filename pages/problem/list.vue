<script setup lang="ts">
import type { VArray } from '~/models/VArray';
import type { VProblemOutline } from '~/models/VProblem';
import type { VResponse } from '~/models/VReponse';

const { t } = useI18n();

const settingsStore = useSettingsStore();

const route = useRoute();
const router = useRouter();

useHead({
    title: `${t('nav.problems')} - ${settingsStore.website.title}`
})


const currentPage = ref(route.query.page ? parseInt(route.query.page as string) : 1);
const pageSize = ref(route.query.pageSize ? parseInt(route.query.pageSize as string) : 20);
const search = ref("");

const columns = [
    {
        title: '标题',
        key: 'title',
        dataIndex: 'title',
    },
    {
        title: '难度',
        key: 'difficulty',
        dataIndex: 'difficulty'
    },
    {
        title: '标签',
        key: 'tags',
        dataIndex: 'tags'
    }
]

const { status, data: problemData, error } = useLazyAsyncData('problem-list', async () => {
    const query = {
        page: currentPage.value,
        //pageSize: pageSize.value,
        search: search.value ? search.value : undefined
    }
    router.replace({ query });
    const res: VResponse<VArray<VProblemOutline>> = await $fetch('/api/problem/list', {
        params: query
    })
    if (res.status === 'success') {
        return res.data;
    }
    else {
        throw new Error(res.error?.message || t('error'));
    }
}, {
    watch: [currentPage, pageSize, search]
});

if (error.value) {
    router.push({ name: 'error', query: { code: (error.value as any)?.statusCode || 500, title: 'error.unable_to_connect_server', message: error.value?.message || '' } });
}
</script>

<template>
    <two-column-layout>
        <template #left>
            <div class="v-card">
                <div class="v-card-title">题库</div>
                <template v-if="status !== 'success' || !problemData">
                    <a-skeleton active />
                </template>
                <div class="v-card-fix-body" v-else>
                    <a-table :data-source="problemData.data" :columns="columns" :pagination="false" size="small">
                        <template #bodyCell="{ column, record }">
                            <template v-if="column.key === 'title'">
                                <nuxt-link :to="'/problem/' + record.id">
                                    {{ record.pid }}. {{ record.title }}
                                </nuxt-link>
                            </template>
                            <template v-if="column.key === 'tags'">
                                <tag-list :tag="record.tags" />
                            </template>
                        </template>
                    </a-table>
                    <div class="v-pagination">
                        <a-pagination v-model:current="currentPage" v-model:page-size="pageSize" :total="problemData.totalRecords" show-less-items />
                    </div>
                </div>
            </div>
        </template>
        <template #right>
            <div class="v-card">
                <div class="v-card-title-small">搜索</div>
                <a-input v-model:value="search" placeholder="搜索题目内容" />
            </div>
        </template>
    </two-column-layout>
</template>