<script setup lang="ts">
import { useNotification } from 'naive-ui';

import type { VResponse } from '~/models/VReponse';
import type { VUserInfo } from '~/models/VUser';

import { sha256 } from 'js-sha256';

const { t } = useI18n();

const settingsStore = useSettingsStore();
const loginUserStore = useLoginUserStore();

const router = useRouter();

definePageMeta({
    ssr: false
})
useHead({
    title: `${t('nav.login')} - ${settingsStore.website.title}`
})

const loading = ref(false);
const errorInfo = ref("");

const notification = useNotification();

const logUser = ref({
    auth: "",
    password: ""
})

async function login() {
    if (!logUser.value.auth || !logUser.value.password) {
        errorInfo.value = t('form.please_input_all_fields');
        return;
    }
    loading.value = true;
    errorInfo.value = "";
    try {
        let passwordHash = logUser.value.password;
        for (let i = 0; i < 100; i++) {
            passwordHash = sha256(passwordHash);
        }
        const res: VResponse<VUserInfo> = await $fetch("/api/user/login", {
            method: "post",
            body: JSON.stringify({
                ...logUser.value,
                password: passwordHash
            })
        })
        if (res.status === 'success') {
            notification.success({
                title: t('base.success'),
                content: t('user.login_success'),
                duration: 2500,
                keepAliveOnHover: true
            });
            loginUserStore.update(res.data);
            router.push('/');
        }
        else {
            errorInfo.value = res.error?.message || t('user.login_failed');
            notification.error({
                title: t('base.error'),
                content: errorInfo.value,
                duration: 2500,
                keepAliveOnHover: true
            });
        }
    }
    catch (e: any) {
        errorInfo.value = e.response?._data?.error?.message || t('user.login_failed');
    }
    finally {
        loading.value = false;
    }
}
</script>

<template>
    <div class="v-center v-card v-card-deep" style="max-width: 500px">
        <div class="v-card-title">{{ $t("nav.login") }}</div>
        <div class="ax-input-box">
            <input class="ax-input" type="text" :placeholder="$t('user.username_email_or_phone')" v-model="logUser.auth"
                :disabled="loading" />
            <div class="ax-input-bar"></div>
        </div>
        <div class="ax-input-box">
            <input class="ax-input" type="password" :placeholder="$t('user.password')" v-model="logUser.password"
                :disabled="loading" />
            <div class="ax-input-bar"></div>
        </div>
        <div class="ax-error-info" v-if="errorInfo">{{ errorInfo }}</div>
        <div class="ax-button-box">
            <div>{{ $t("user.no_account_immediate") }}<router-link to="/user/register">{{ $t('nav.register')
                    }}</router-link></div>
            <n-button type="info" style="border-radius: 0; padding-left: 40px; padding-right: 40px;" @click="login"
                :disabled="loading">登录</n-button>
        </div>
    </div>
</template>