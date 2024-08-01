<script setup lang="ts">
const props = defineProps<{
    rate: number,
    color: string,
    active: boolean
}>();
</script>
<template>
    <div class="v-progress" :class="{ active }">
        <div class="v-progress-bar" :style="{ width: rate + '%', backgroundColor: color }"></div>
    </div>
</template>

<style scoped>
.v-progress {
    width: 100%;
    height: 10px;
    background-color: #f0f0f0;
}

.v-progress-bar {
    position: relative;
    height: 100%;

    transition: all .2s;
}

.v-progress.active .v-progress-bar::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 0;
    opacity: 0;
    background: linear-gradient(90deg, rgba(255, 255, 255, .3) 0%, rgba(255, 255, 255, .5) 100%);
    animation: v-progress-bar 2s cubic-bezier(.4, 0, .2, 1) infinite;
}

@keyframes v-progress-bar {
    0% {
        width: 0%;
        opacity: 1;
    }

    66% {
        width: 100%;
        opacity: 0;
    }

    100% {
        width: 0%;
        opacity: 0;
    }
}
</style>