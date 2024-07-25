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
    <n-grid cols="4" :x-gap="20" :y-gap="12" item-responsive responsive="screen">
        <n-grid-item span="4 l:3">
            <div class="v-card">
                <div class="v-card-title">题库</div>
                <template v-if="status !== 'success' || !problemData">
                    <n-skeleton text :repeat="2" /> <n-skeleton text style="width: 60%" />
                </template>
                <div class="v-card-fix-body" v-else>
                    <n-table size="small">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>{{ $t("problem.title") }}</th>
                                <th>{{ $t("problem.difficulty") }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="problem in problemData.data" :key="problem.id">
                                <td>{{ problem.pid }}</td>
                                <td><router-link :to='`/problem/${problem.id}`'>{{ problem.title }}</router-link></td>
                                <td>{{ problem.difficulty }}</td>
                            </tr>
                        </tbody>
                    </n-table>
                    <div class="v-pagination">
                        <n-pagination v-model:page="currentPage"
                            v-model:page-size="pageSize" :page-count="problemData.totalPages" />
                    </div>
                </div>
            </div>
        </n-grid-item>
        <n-grid-item span="4 l:1">
            <div class="v-card">
                <div class="v-card-title-small">搜索</div>
                <n-input v-model:value="search"></n-input>
            </div>
        </n-grid-item>
    </n-grid>
</template>