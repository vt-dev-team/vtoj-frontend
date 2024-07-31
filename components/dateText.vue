<script setup lang="ts">
const props = defineProps<{
    date: Date | string | number;
}>();

const $dayjs = useDayjs();
const fromNowText = $dayjs(props.date).fromNow();
const formatText = $dayjs(props.date).format('YYYY-MM-DD HH:mm:ss');
</script>

<template>
    <a-tooltip trigger="hover">
        <template #title>
            <span>{{ formatText }}</span>
        </template>
        <span>{{ fromNowText }}</span>
    </a-tooltip>
</template>