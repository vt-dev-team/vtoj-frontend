<script setup lang="ts">
// TODO: 加载状态，还有SSR好像没管用
import type { VProblemOutline, VProblemSearchParam } from '~/models/VProblem';
import type { VResponse } from '~/models/VReponse';

const { t } = useI18n();

const settingsStore = useSettingsStore();

const route = useRoute();
const router = useRouter();

useHead({
    title: `${t('nav.problems')} - ${settingsStore.website.title}`
})

const search: Ref<VProblemSearchParam> = ref({
    page: route.query.page ? parseInt(route.query.page as string) : 1,
    pageSize: route.query.pageSize ? parseInt(route.query.pageSize as string) : 25,
    search: route.query.search ? route.query.search as string : "",
})

const { status, data: problemList, error } = useLazyAsyncData('problem-list', async () => {
    const res: VResponse<VProblemOutline[]> = await $fetch('/api/problem/list', {
        params: search.value
    })
    if (res.status === 'success') {
        return res.data;
    }
    else {
        throw new Error(res.error?.message || t('error'));
    }
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
                <template v-if="status !== 'success' || !problemList">
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
                            <tr v-for="problem in problemList" :key="problem.id">
                                <td>{{ problem.pid }}</td>
                                <td><router-link :to='`/problem/${problem.id}`'>{{ problem.title }}</router-link></td>
                                <td>{{ problem.difficulty }}</td>
                            </tr>
                        </tbody>
                    </n-table>
                </div>
            </div>
        </n-grid-item>
        <n-grid-item span="4 l:1">
            <div class="v-card">
                <div class="v-card-title-small">搜索</div>
                <n-input v-model:value="search.search"></n-input>
            </div>
        </n-grid-item>
    </n-grid>
</template>