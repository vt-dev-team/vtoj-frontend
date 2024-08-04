<script setup lang="ts">
import type { VContestBasicInfo } from '~/models/VContest';
import { VFetchError, type VResponse } from '~/models/VReponse';

import { marked } from 'marked';

const { t } = useI18n();

const settingsStore = useSettingsStore();
const loginUserStore = useLoginUserStore();

const route = useRoute();
const router = useRouter();

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

const contestId = route.params.id;

const contestTypeDict = ["contest.normal_practice", "contest.ACM", "contest.OI"];

const { status, data: contestInfo, error } = useLazyAsyncData(`contest-info-${contestId}`, async () => {
    const res: VResponse<{ contest: VContestBasicInfo, status: 0 | 1 | 2 }> = await $fetch(`/api/contest/${contestId}`)
    if (res.status === 'success') {
        if (res.data === null) {
            throw new VFetchError(404, t('error.contest_not_found'));
        }
        res.data.contest.description = marked.parse(res.data.contest.description) as string;
        return res.data;
    }
    else {
        throw new VFetchError(res.error.code, res.error?.message || t('error'));
    }
});

if (error.value) {
    router.push({ name: 'error', query: { code: (error.value as any)?.code || 500, title: 'error.unable_to_connect_server', message: error.value?.message || '' } });
}

watch(contestInfo, (newContestInfo) => {
    if (newContestInfo) {
        useHead({
            title: `${t('nav.contest')}${newContestInfo.contest.id}. ${newContestInfo.contest.title} - ${settingsStore.website.title}`
        })
    }
})

const isEnded = computed(() => {
    if (!contestInfo.value) {
        return true;
    }
    return dayjs().isAfter(contestInfo.value.contest.endTime);
})

const canParticipate = computed(() => {
    if (!contestInfo.value) {
        return false;
    }
    // 已经报名了或者是管理员了，就不要报名了
    if ((contestInfo.value.status || 0) > 0) {
        return false;
    }
    // 不登陆不能参加比赛
    if (!loginUserStore.login) {
        return false;
    }
    // 比赛还未开始，就可以报名
    if (!isEnded.value) {
        return true;
    }
    return false;
})

const contestUserRole = computed(() => {
    if (!contestInfo.value) {
        return "未报名";
    }
    if (contestInfo.value.status === 0) {
        return "未报名";
    }
    if (contestInfo.value.status === 1) {
        return "参赛者";
    }
    if (contestInfo.value.status === 2) {
        return "管理员";
    }
    return "未报名";
})

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
function contestRate(contest: VContestBasicInfo) {
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

function getContestRateColor(contest: VContestBasicInfo) {
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

function calcDuration(contest: VContestBasicInfo) {
    return formatTime(dayjs(contest.endTime).diff(contest.startTime));
}

function contestStatus(contest: VContestBasicInfo) {
    if (dayjs().isBefore(contest.startTime)) {
        return t('contest.not_started');
    }
    if (dayjs().isAfter(contest.endTime)) {
        return t('contest.ended');
    }
    return t('contest.ongoing');
}

function contestStatusClass(contest: VContestBasicInfo) {
    if (dayjs().isBefore(contest.startTime)) {
        return 'success';
    }
    if (dayjs().isAfter(contest.endTime)) {
        return '';
    }
    return 'danger';
}

function contestTooltipTitle(contest: VContestBasicInfo): string {
    if (nowTime.value.isBefore(contest.startTime)) {
        return `${t('contest.start_from')} ${dayjs(contest.startTime).fromNow()}`;
    }
    return `${t('contest.end_at')} ${dayjs(contest.endTime).fromNow()}`;
}

function gotoLink(link: string) {
    router.push(link);
}
</script>

<template>
    <two-column-layout>
        <template #left>
            <div class="v-card">
                <template v-if="status !== 'success' || !contestInfo">
                    <a-skeleton active />
                </template>
                <template v-else>
                    <div class="v-card-title">{{ $t('nav.contest') }}{{ contestInfo.contest.id }}. {{
                        contestInfo.contest.title }}</div>
                    <a-space>
                        <a-tooltip>
                            <template #title>
                                <div>
                                    <div>{{ t('contest.start_time') }}: {{ formatDate(contestInfo.contest.startTime) }}
                                    </div>
                                    <div>{{ t('contest.end_time') }}: {{ formatDate(contestInfo.contest.endTime) }}
                                    </div>
                                </div>
                            </template>
                            <a-space>
                                <!-- 比赛中，未开始或者已结束-->
                                <span class="v-tag v-tag-link" :class="contestStatusClass(contestInfo.contest)">
                                    {{ contestStatus(contestInfo.contest) }}
                                </span>
                                <span class="v-tag v-tag-link warning">
                                    <clock-circle-filled />
                                    {{ $t('contest.duration') }} {{
                                        calcDuration(contestInfo.contest) }}</span>
                            </a-space>
                        </a-tooltip>
                        <span class="v-tag v-tag-link">
                            <template v-if="contestInfo.contest.isPublic">{{ t('contest.public') }}</template>
                            <template v-else>{{ t('contest.private') }}</template>
                        </span>
                        <span class="v-tag v-tag-link primary">{{ $t(contestTypeDict[contestInfo.contest.mode])
                            }}</span>
                    </a-space>
                    <div class="v-card-fix-body v-contest-footer">
                        <a-tooltip>
                            <template #title>
                                <div>
                                    {{ contestTooltipTitle(contestInfo.contest) }}
                                </div>
                            </template>
                            <v-progress :rate="contestRate(contestInfo.contest)"
                                :color="getContestRateColor(contestInfo.contest)"
                                :active="!isEnded" />
                        </a-tooltip>
                    </div>
                    <a-divider />
                    <div class="v-problem-info" v-html="contestInfo.contest.description"></div>
                </template>
            </div>
            <div class="v-card">
                <div class="v-card-title-small">比赛公告</div>
            </div>
        </template>
        <template #right>
            <div class="v-card">
                <template v-if="status !== 'success' || !contestInfo">
                    <a-skeleton active />
                </template>
                <template v-else>
                    <div class="v-card-fix-body" style="margin-top: -16px">
                        <div class="v-list v-list-hover">
                            <template v-if="contestInfo.status === 0">
                                <!-- 还未参赛，并且比赛还未开始，就可以报名-->
                                <template v-if="canParticipate">
                                    <div class="v-list-item primary">报名比赛</div>
                                </template>
                                <template v-else-if="isEnded">
                                    <div class="v-list-item grey unhover">比赛已经结束</div>
                                </template>
                                <template v-else>
                                    <div class="v-list-item primary" @click="gotoLink('/user/login')">登录后报名比赛</div>
                                </template>
                            </template>
                            <template v-else>
                                <div class="v-list-item unhover primary">您已报名比赛，身份是：{{ contestUserRole }}</div>
                            </template>
                            <div class="v-list-item">比赛信息</div>
                            <template v-if="contestInfo.status > 0 || isEnded">
                                <div class="v-list-item">题目列表</div>
                                <div class="v-list-item">排行榜</div>
                            </template>
                            <template v-if="contestInfo.status === 2">
                                <div class="v-list-item">参赛成员管理</div>
                                <div class="v-list-item">比赛管理</div>
                            </template>
                        </div>
                    </div>
                </template>
            </div>
            <div class="v-card">
                <div class="v-card-title-small">当前时间</div>
                {{ nowTime.format('YYYY-MM-DD HH:mm:ss') }}
            </div>
        </template>
    </two-column-layout>
</template>