<script setup lang="ts">
const props = defineProps<{
    score: number;
}>();

// 根据score计算颜色，颜色越高，越绿，颜色过低，就是红色，10分1档。
const scoreColorCalc = (score: number) => {
    if (score >= 90) {
        return 'green';
    }
    else if (score >= 80) {
        return 'yellow';
    }
    else if (score >= 70) {
        return 'orange';
    }
    else {
        return 'red';
    }
};
</script>

<template>
    <span :class="`score-${scoreColorCalc(score)}`">{{ score }}</span>
</template>

<style scoped>
.score-green {
    color: #47af50;
}

.score-yellow {
    color: #fbbd08;
}

.score-orange {
    color: #f2711c;
}

.score-red {
    color: #db2828;
}
</style>
