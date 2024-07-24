<script setup lang="ts">
const props = defineProps<{
    problem: {
        id: number;
        pid: string;
        title: string;
    };
}>();

const problemLink = `/problem/${props.problem.id}`;
</script>

<template>
    <router-link :to="problemLink">
        {{ problem.pid }}. {{ problem.title }}
    </router-link>
</template>