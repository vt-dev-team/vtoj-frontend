<script setup lang="ts">
import { type FormInst, useNotification } from 'naive-ui';

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
    title: `${t('nav.register')} - ${settingsStore.website.title}`
})

//---
const regForm = ref<FormInst | null>(null)

const regUser = ref({
    username: '',
    password: '',
    rptPassword: '',
    email: '',
    phone: '',
    realname: '',
    studentId: ''
});

function validatePasswordStartWith(
    rule: any,
    value: string
): boolean {
    return (
        !!regUser.value.password &&
        regUser.value.password.startsWith(value) &&
        regUser.value.password.length >= value.length
    )
}

function validatePasswordSame(rule: any, value: string): boolean {
    return value === regUser.value.password
}

const loading = ref(false);

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
            required: true,
            message: t('form.please_input', [t('form.repeat', [t('user.password')])])
        },
        {
            validator: validatePasswordStartWith,
            message: t('form.password_not_same'),
            trigger: 'input'
        },
        {
            validator: validatePasswordSame,
            message: t('form.password_not_same'),
            trigger: ['blur', 'password-input']
        }
    ],
    email: [
        {
            required: true,
            message: t('form.please_input', [t('user.email')])
        },
        {
            type: 'email',
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
    ]
}

// ---

const notification = useNotification();

function register() {
    regForm.value?.validate(async (errors: any) => {
        if (!errors) {
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
                loading.value = false;
                if (res.status === 'success') {
                    notification.success({
                        title: t('success'),
                        content: t('user.register_success'),
                        duration: 2500,
                        keepAliveOnHover: true
                    });
                    loginUserStore.update(res.data);
                    router.push('/');
                }
                else {
                    notification.error({
                        title: t('error'),
                        content: res.error?.message || t('error'),
                        duration: 2500,
                        keepAliveOnHover: true
                    })
                }
            }
            catch (e: any) {
                notification.error({
                    title: t('base.error'),
                    content: e.response?._data?.error?.message || t('user.login_failed'),
                    duration: 2500,
                    keepAliveOnHover: true
                })
            }
        }
        else {
            notification.error({
                title: t('base.error'),
                content: t('form.validate_error'),
                duration: 2500,
                keepAliveOnHover: true
            })
        }
    })
}
</script>

<template>
    <div class="v-card">
        <div class="v-card-title">{{ $t("nav.register") }}</div>
        <n-form ref="regForm" :model="regUser" :rules="rules">
            <n-form-item path="username" :label="$t('user.username')">
                <n-input v-model:value="regUser.username"
                    :placeholder="$t('form.please_input', [$t('user.username')])" />
            </n-form-item>
            <n-form-item path="password" :label="$t('user.password')">
                <n-input type="password" v-model:value="regUser.password"
                    :placeholder="$t('form.please_input', [$t('user.password')])" />
            </n-form-item>
            <n-form-item path="rptPassword" :label="$t('form.repeat', [$t('user.password')])">
                <n-input type="password" v-model:value="regUser.rptPassword"
                    :placeholder="$t('form.please_input', [$t('form.repeat', [$t('user.password')])])" />
            </n-form-item>
            <n-form-item path="email" :label="$t('user.email')">
                <n-input v-model:value="regUser.email" :placeholder="$t('form.please_input', [$t('user.email')])" />
            </n-form-item>
            <n-form-item path="phone" :label="$t('user.phone')">
                <n-input v-model:value="regUser.phone" :placeholder="$t('form.please_input', [$t('user.phone')])" />
            </n-form-item>
            <n-form-item path="realname" :label="$t('user.realname')">
                <n-input v-model:value="regUser.realname"
                    :placeholder="$t('form.please_input', [$t('user.realname')])" />
            </n-form-item>
            <n-form-item path="studentId" :label="$t('user.student_id')">
                <n-input v-model:value="regUser.studentId"
                    :placeholder="$t('form.please_input', [$t('user.student_id')])" />
            </n-form-item>
        </n-form>
        <div class="v-explain-text">{{ $t("user.has_account_immediate") }}<router-link to="/user/login">{{
            $t('nav.login') }}</router-link>
        </div>
        <n-button type="info" style="border-radius: 0; padding-left: 40px; padding-right: 40px;" @click="register"
            :disabled="loading">{{
                $t('nav.register') }}</n-button>
    </div>
</template>