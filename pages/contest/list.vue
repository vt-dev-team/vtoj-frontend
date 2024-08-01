<script setup lang="ts">
import type { VArray } from '~/models/VArray';
import type { VContestOutline } from '~/models/VContest';
import type { VResponse } from '~/models/VReponse';

const { t } = useI18n();

const settingsStore = useSettingsStore();

const route = useRoute();
const router = useRouter();

useHead({
    title: `${t('nav.contest')} - ${settingsStore.website.title}`
})

const dayjs = useDayjs();

const nowTime = ref(dayjs());
// 设置一个Interval，每秒更新一次时间
let timeSetter: NodeJS.Timeout;
onNuxtReady(() => {
    timeSetter = setInterval(() => {
        nowTime.value = dayjs();
    }, 1000);
})
// 在离开页面后需要销毁
onUnmounted(() => {
    clearInterval(timeSetter);
});

const currentPage = ref(route.query.page ? parseInt(route.query.page as string) : 1);
const pageSize = ref(route.query.pageSize ? parseInt(route.query.pageSize as string) : 20);
const search = ref("");

const contestTypeDict = ["contest.normal_practice", "contest.ACM", "contest.OI"];

const { status, data: contestData, error } = useLazyAsyncData('contest-list', async () => {
    const query = {
        page: currentPage.value,
        //pageSize: pageSize.value,
        search: search.value ? search.value : undefined
    }
    router.replace({ query });
    const res: VResponse<VArray<VContestOutline>> = await $fetch('/api/contest/list', {
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

function formatTime(milisec: number) {
    const allSec = Math.floor(milisec / 1000);
    const formats: [number, string][] = [
        [60, '秒'],
        [60, '分'],
        [24, '小时'],
        [1000, '天']
    ];
    let result = '';
    let cur = allSec;
    for (let i = 0; i < formats.length; i++) {
        const format = formats[i];
        const value = cur % format[0];
        cur = Math.floor(cur / format[0]);
        if (value > 0) {
            result = value + format[1] + result;
        }
        if (cur === 0) {
            break;
        }
    }
    return result;
}

function formatDate(date: Date): string {
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
}

// 需要每秒更新
function contestRate(contest: VContestOutline) {
    if (dayjs().isBefore(contest.startTime)) {
        return 0;
    }
    if (dayjs().isAfter(contest.endTime)) {
        return 100;
    }
    if (contest.endTime === null) {
        return 0;
    }
    if (dayjs(contest.endTime).diff(contest.startTime) === 0) {
        return 100;
    }
    return nowTime.value.diff(contest.startTime) / dayjs(contest.endTime).diff(contest.startTime) * 100;
}

function getContestRateColor(contest: VContestOutline) {
    const rate = contestRate(contest);
    if (rate === 100) {
        return '#aaa';
    }
    if (rate < 30) {
        return '#1780db';
    }
    if (rate < 60) {
        return '#f0ad4e';
    }
    else {
        return '#db2828';
    }
}

function calcDuration(contest: VContestOutline) {
    return formatTime(dayjs(contest.endTime).diff(contest.startTime));
}

function contestStatus(contest: VContestOutline) {
    if (dayjs().isBefore(contest.startTime)) {
        return t('contest.not_started');
    }
    if (dayjs().isAfter(contest.endTime)) {
        return t('contest.ended');
    }
    return t('contest.ongoing');
}

function contestStatusClass(contest: VContestOutline) {
    if (dayjs().isBefore(contest.startTime)) {
        return 'success';
    }
    if (dayjs().isAfter(contest.endTime)) {
        return '';
    }
    return 'danger';
}

function contestTooltipTitle(contest: VContestOutline): string {
    if (nowTime.value.isBefore(contest.startTime)) {
        return `${t('contest.start_from')} ${dayjs(contest.startTime).fromNow()}`;
    }
    return `${t('contest.end_at')} ${dayjs(contest.endTime).fromNow()}`;
}
</script>

<template>
    <two-column-layout>
        <template #left>
            <template v-if="status !== 'success' || !contestData">
                <div class="v-card">
                    <a-skeleton active />
                </div>
            </template>
            <template v-else>
                <div class="v-card" v-for="contest in contestData.data" :key="contest.id">
                    <h2 class="v-list-title">{{ contest.title }}</h2>
                    <a-space>
                        <span class="v-tag v-tag-link">
                            <template v-if="contest.isPublic">{{ t('contest.public') }}</template>
                            <template v-else>{{ t('contest.private') }}</template>
                        </span>
                        <span class="v-tag v-tag-link primary">{{ $t(contestTypeDict[contest.mode])
                            }}</span>
                        <a-tooltip>
                            <template #title>
                                <div>
                                    <div>{{ t('contest.start_time') }}: {{ formatDate(contest.startTime) }}</div>
                                    <div>{{ t('contest.end_time') }}: {{ formatDate(contest.endTime) }}</div>
                                </div>
                            </template>
                            <a-space>
                                <span class="v-tag v-tag-link warning">
                                    <clock-circle-filled />
                                    {{ $t('contest.duration') }} {{
                                        calcDuration(contest) }}</span>
                                <!-- 比赛中，未开始或者已结束-->
                                <span class="v-tag v-tag-link" :class="contestStatusClass(contest)">
                                    {{ contestStatus(contest) }}
                                </span>
                            </a-space>
                        </a-tooltip>
                    </a-space>
                    <div class="v-card-fix-body v-contest-footer">
                        <a-tooltip>
                            <template #title>
                                <div>
                                    {{ contestTooltipTitle(contest) }}
                                </div>
                            </template>
                            <v-progress :rate="contestRate(contest)" :color="getContestRateColor(contest)"
                                :active="nowTime.isBefore(contest.endTime)" />
                        </a-tooltip>
                    </div>
                </div>
                <div class="v-pagination">
                    <a-pagination v-model:current="currentPage" v-model:page-size="pageSize"
                        :total="contestData.totalRecords" show-less-items />
                </div>
                <!--div class="v-card">
                    <div class="v-card-fix-body" style="margin-top: -16px">
                        <div class="v-pagination">
                            <a-pagination v-model:current="currentPage" v-model:page-size="pageSize"
                                :total="contestData.totalRecords" show-less-items />
                        </div>
                    </div>
                </div-->
            </template>
        </template>
        <template #right>
            <div class="v-card">
                <div class="v-card-title-small">当前时间</div>
                {{ nowTime.format('YYYY-MM-DD HH:mm:ss') }}
            </div>
        </template>
    </two-column-layout>
</template>