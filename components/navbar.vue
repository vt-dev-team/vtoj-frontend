<script setup lang="ts">;
import { NIcon } from 'naive-ui';
import { ChevronDownOutline } from '@vicons/ionicons5';

const settingsStore = useSettingsStore();
const loginUserStore = useLoginUserStore();

const renderIcon = (icon: Component) => {
    return () => {
        return h(NIcon, null, {
            default: () => h(icon)
        })
    }
}

const router = useRouter();

const navs: [string, string, string, number][] = [
    ["nav.home", "/", "home", 1],
    ["nav.problems", "/problem/list", "problem", 1],
    ["nav.contest", "/contest/list", "contest", 1],
    ["nav.status", "/submission/list", "status", 1],
    ["nav.rank", "/user/rank", "rank", 1],
]

const userDropdown = [{
    label: '个人信息',
    key: "userinfo"
}, {
    label: '注销',
    key: "logout"
}]

async function handleSelect(key: string | number) {
    switch (key) {
        case 'userinfo':
            if (loginUserStore.user)
                router.push(`/user/${loginUserStore.user.id}`);
            else
                router.push('/user/login');
            break;
        case 'logout':
            try {
                await $fetch('/api/user/logout', { method: "POST" });
                loginUserStore.logout();
            }
            catch (e) { }
            break;
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
                    <router-link class="nav-item" :to="nav[1]">
                        <div class="nav-item-content">
                            <div class="nav-item-content__text">
                                {{ $t(nav[0]) }}
                            </div>
                        </div>
                    </router-link>
                </template>
            </div>
            <div class="v-navbar-bar">
                <template v-if="loginUserStore.login">
                    <n-dropdown trigger="click" :options="userDropdown" @select="handleSelect">
                        <div class="nav-item">
                            <div class="nav-item-content">
                                <div class="nav-item-content__text">
                                    {{ loginUserStore.user?.username }} <n-icon>
                                        <ChevronDownOutline />
                                    </n-icon>
                                </div>
                            </div>
                        </div>
                    </n-dropdown>
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