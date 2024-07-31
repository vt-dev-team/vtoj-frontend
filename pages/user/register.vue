<script setup lang="ts">
import type { VResponse } from '~/models/VReponse';
import type { VUserInfo } from '~/models/VUser';

import { sha256 } from 'js-sha256';
import type { Rule } from 'ant-design-vue/es/form';

const { t } = useI18n();

const settingsStore = useSettingsStore();
const loginUserStore = useLoginUserStore();

const router = useRouter();

useHead({
    title: `${t('nav.register')} - ${settingsStore.website.title}`
})

//---
const regUser = ref({
    username: '',
    password: '',
    rptPassword: '',
    email: '',
    phone: '',
    realname: '',
    studentId: ''
});

const loading = ref(false);

const validatePass = async (_rule: Rule, value: string) => {
    if (value === '') {
        return Promise.reject('请再次输入密码');
    } else if (value !== regUser.value.password) {
        return Promise.reject("密码不一致");
    } else {
        return Promise.resolve();
    }
};

const rules = {
    username: [
        {
            required: true,
            message: t('form.please_input', [t('user.username')])
        }
    ],
    password: [
        {
            required: true,
            message: t('form.please_input', [t('user.password')])
        }
    ],
    rptPassword: [
        {
            validator: validatePass,
            trigger: 'change'
        }
    ],
    email: [
        {
            required: true,
            message: t('form.please_input', [t('user.email')])
        },
        {
            pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
            message: t('form.email_format_error'),
            trigger: 'blur'
        }
    ],
    phone: [
        {
            required: true,
            message: t('form.please_input', [t('user.phone')])
        },
        {
            pattern: /^1[3456789]\d{9}$/,
            message: t('form.phone_format_error'),
            trigger: 'blur'
        }
    ],
}

// ---

async function register() {
    loading.value = true;
    try {
        let passwordHash = regUser.value.password;
        for (let i = 0; i < 100; i++) {
            passwordHash = sha256(passwordHash);
        }
        const res: VResponse<VUserInfo> = await $fetch("/api/user/register", {
            method: "post",
            body: JSON.stringify({
                ...regUser.value,
                password: passwordHash
            })
        })
        if (res.status === 'success') {
            notification.success({
                message: t('success'),
                description: t('user.register_success')
            });
            loginUserStore.update(res.data);
            router.push('/');
        }
        else {
            notification.error({
                message: t('error'),
                description: res.error?.message || t('error'),
            })
        }
    }
    catch (e: any) {
        notification.error({
            message: t('base.error'),
            description: e.response?._data?.error?.message || t('user.login_failed'),
        })
    }
    finally {
        loading.value = false;
    }
}

function onFinish() {
    register();
}

function onFinishFailed() {
    notification.error({
        message: t('base.error'),
        description: t('form.please_input_all_fields'),
    })
}
</script>

<template>
    <div class="v-card">
        <div class="v-card-title">{{ $t("nav.register") }}</div>
        <a-form layout="vertical" ref="regForm" :model="regUser" :rules="rules" @finish="onFinish"
            @finishFailed="onFinishFailed">
            <a-form-item name="username" :label="$t('user.username')">
                <a-input v-model:value="regUser.username"
                    :placeholder="$t('form.please_input', [$t('user.username')])" />
            </a-form-item>
            <a-form-item name="password" :label="$t('user.password')">
                <a-input type="password" v-model:value="regUser.password"
                    :placeholder="$t('form.please_input', [$t('user.password')])" />
            </a-form-item>
            <a-form-item name="rptPassword" :label="$t('form.repeat', [$t('user.password')])">
                <a-input type="password" v-model:value="regUser.rptPassword"
                    :placeholder="$t('form.please_input', [$t('form.repeat', [$t('user.password')])])" />
            </a-form-item>
            <a-form-item name="email" :label="$t('user.email')">
                <a-input v-model:value="regUser.email" :placeholder="$t('form.please_input', [$t('user.email')])" />
            </a-form-item>
            <a-form-item name="phone" :label="$t('user.phone')">
                <a-input v-model:value="regUser.phone" :placeholder="$t('form.please_input', [$t('user.phone')])" />
            </a-form-item>
            <a-form-item name="realname" :label="$t('user.realname')">
                <a-input v-model:value="regUser.realname"
                    :placeholder="$t('form.please_input', [$t('user.realname')])" />
            </a-form-item>
            <a-form-item name="studentId" :label="$t('user.student_id')">
                <a-input v-model:value="regUser.studentId"
                    :placeholder="$t('form.please_input', [$t('user.student_id')])" />
            </a-form-item>
            <div class="v-explain-text">{{ $t("user.has_account_immediate") }}<router-link to="/user/login">{{
                $t('nav.login') }}</router-link>
            </div>
            <a-button type="primary" htmlType="submit"
                style="border-radius: 0; padding-left: 40px; padding-right: 40px;" :disabled="loading">{{
                    $t('nav.register') }}</a-button>
        </a-form>
    </div>
</template>