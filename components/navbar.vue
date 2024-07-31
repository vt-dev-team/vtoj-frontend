<script setup lang="ts">;
import { HomeFilled, AppstoreFilled, TrophyFilled, SignalFilled, FundFilled } from '@ant-design/icons-vue';

const settingsStore = useSettingsStore();
const loginUserStore = useLoginUserStore();

const router = useRouter();

const navs: [string, string, string, Component, number][] = [
    ["nav.home", "/", "home", HomeFilled, 1],
    ["nav.problems", "/problem/list", "problem", AppstoreFilled, 1],
    ["nav.contest", "/contest/list", "contest", TrophyFilled, 1],
    ["nav.status", "/submission/list", "status", FundFilled, 1],
    ["nav.rank", "/user/rank", "rank", SignalFilled, 1],
]

const userDropdown = [{
    label: '个人信息',
    key: "userinfo"
}, {
    label: '注销',
    key: "logout"
}]

async function logout() {
    try {
        await $fetch('/api/user/logout', { method: "POST" });
        loginUserStore.logout();
    }
    catch (e) {
        notification.error({
            message: '出现错误',
            description: '注销失败，请重试',
        });
    }
}
</script>

<template>
    <div class="v-navbar">
        <div class="v-container v-navbar-container">
            <div class="v-navbar-bar">
                <div class="nav-item nav-logo">
                    <div class="nav-item-content">
                        <div class="nav-item-content__text">
                            <div class="nav-link">{{ settingsStore.website.title }}</div>
                        </div>
                    </div>
                </div>
                <template v-for="(nav, i) in navs" :key="i">
                    <nuxt-link class="nav-item" :to="nav[1]">
                        <div class="nav-item-content">
                            <div class="nav-item-content__icon">
                                <component :is="nav[3]" />
                            </div>
                            <div class="nav-item-content__text">
                                {{ $t(nav[0]) }}
                            </div>
                        </div>
                    </nuxt-link>
                </template>
            </div>
            <div class="v-navbar-bar">
                <template v-if="loginUserStore.login">
                    <a-dropdown :trigger="['click']">
                        <div class="nav-item">
                            <div class="nav-item-content">
                                <div class="nav-item-content__text">
                                    {{ loginUserStore.user?.username }}
                                    <DownOutlined />
                                </div>
                            </div>
                        </div>
                        <template #overlay>
                            <a-menu>
                                <a-menu-item key="0">
                                    <nuxt-link :to="`/user/${loginUserStore.user?.id}`">我的信息</nuxt-link>
                                </a-menu-item>
                                <a-menu-divider />
                                <a-menu-item key="3" @click="logout()">注销</a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>
                </template>
                <template v-else>
                    <router-link to="/user/login" class="nav-item">
                        <div class="nav-item-content">
                            <div class="nav-item-content__text">
                                {{ $t("nav.login") }}
                            </div>
                        </div>
                    </router-link>
                    <router-link to="/user/register" class="nav-item">
                        <div class="nav-item-content">
                            <div class="nav-item-content__text">
                                {{ $t("nav.register") }}
                            </div>
                        </div>
                    </router-link>
                </template>
            </div>
        </div>
    </div>
</template>