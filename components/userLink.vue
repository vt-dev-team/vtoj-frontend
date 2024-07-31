<script setup lang="ts">
import type { VUserOutline } from '~/models/VUser';

const props = defineProps<{
    user: VUserOutline;
}>();

const userLink = `/user/${props.user.id}`;
const userTags = props.user.tag.split(',');
// 去除空白标签
userTags.forEach((tag, index) => {
    if (tag.trim() === '') {
        userTags.splice(index, 1);
    }
});

// 根据user.rating计算颜色
const ratingColorCalc = (rating: number) => {
    if (rating >= 2400) {
        return 'red';
    }
    else if (rating >= 2000) {
        return 'orange';
    }
    else if (rating >= 1600) {
        return 'yellow';
    }
    else if (rating >= 1200) {
        return 'green';
    }
    else if (rating >= 800) {
        return 'blue';
    }
    else {
        return 'gray';
    }
};
const ratingColor = ratingColorCalc(props.user.rating);
</script>

<template>
    <router-link :to="userLink" :class="`user-${ratingColor}`">
        {{ user.username }}
        <a-tag v-for="tag in userTags" :key="tag">{{ tag }}</a-tag>
    </router-link>
</template>

<style scoped>
.user-red {
    color: #db2828;
}
.user-orange {
    color: #f2711c;
}
.user-yellow {
    color: #fbbd08;
}
.user-green {
    color: #47af50;
}
.user-blue {
    color: #2185d0;
}
.user-gray {
    color: #767676;
}
</style>