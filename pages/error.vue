<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const errorCode = Number(route.query.code) || 500;
const errorTitle = route.query.title as string || `${errorCode}错误`
const errorMessage = route.query.message as string || 'An error occurred.';

function gotoHome() {
    router.push('/');
}

function back() {
    router.back();
}
</script>

<template>
    <div class="v-center v-card" style="max-width: 500px">
        <h1>{{ $t(errorTitle) }}</h1>
        <a-divider />
        <pre>Error Code：{{ errorCode }}
Message：{{ errorMessage }}</pre>
        <a-divider />
        <a-space>
            <a-button type="primary" @click="gotoHome()">首页</a-button>
            <a-button @click="back()">返回</a-button>
        </a-space>
    </div>
</template>