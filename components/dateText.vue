<script setup lang="ts">
const props = defineProps<{
    date: Date | string | number;
}>();

const $dayjs = useDayjs();
const fromNowText = $dayjs(props.date).fromNow();
const formatText = $dayjs(props.date).format('YYYY-MM-DD HH:mm:ss');
</script>

<template>
    <n-tooltip trigger="hover">
        <template #trigger>
            <span>{{ fromNowText }}</span>
        </template>
        <span>{{ formatText }}</span>
    </n-tooltip>
</template>