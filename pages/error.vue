<script setup lang="ts">
import { NDivider } from 'naive-ui';

const route = useRoute();

const errorCode = Number(route.query.code) || 500;
const errorTitle = route.query.title as string || `${errorCode}错误`
const errorMessage = route.query.message as string || 'An error occurred.';
</script>

<template>
    <div class="v-center v-card" style="max-width: 500px">
        <h1>{{ $t(errorTitle) }}</h1>
        <n-divider></n-divider>
        <pre>Error Code：{{ errorCode }}
Message：{{ errorMessage }}</pre>
    </div>
</template>