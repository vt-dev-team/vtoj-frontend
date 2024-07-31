<script lang="ts" setup>
const props = defineProps<{
    tag: string
}>();

const tags = props.tag.split(",").map(x => x.trim()).filter(x => x);

// Calc hash number of a string
function hashCode(str: string) {
    let hash = 0;
    if (str.length == 0) return hash;
    for (let i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & 0xffffffff; // Convert to 32bit integer
    }
    return hash;
}

const colors = ['pink', 'red', 'orange', 'green', 'cyan', 'blue', 'purple'];
</script>
<template>
    <a-tag v-for="(t, i) in tags" :key="i" :color="colors[hashCode(t) % colors.length]">{{ t }}</a-tag>
</template>