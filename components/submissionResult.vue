<script setup lang="ts">
import { CheckmarkOutline, CloseOutline, HourglassOutline, ServerOutline, SettingsOutline, TimeOutline } from '@vicons/ionicons5';

const props = defineProps<{
    result: number;
}>();

const statusCode = [
    ['Pending', 'blue', HourglassOutline],
    ['Pending Rejudge', 'blue', HourglassOutline],
    ['Judging', 'blue', HourglassOutline],
    ['Accepted', 'green', CheckmarkOutline],
    ['Wrong Answer', 'red', CloseOutline],
    ['Time Limit Exceeded', 'yellow', TimeOutline],
    ['Memory Limit Exceeded', 'purple', ServerOutline],
    ['Output Limit Exceeded', 'red', CloseOutline],
    ['Runtime Error', 'red', CloseOutline],
    ['Unknown Error', 'red', CloseOutline],
    ['System Error', 'red', SettingsOutline],
    ['Unaccepted', 'red', CloseOutline]
];

const resultText = statusCode[props.result][0];
const resultColor = statusCode[props.result][1];
const resultIcon = statusCode[props.result][2];
</script>

<template>
    <span class="v-result" :class="resultColor">
        <n-icon>
            <resultIcon />
        </n-icon>{{ resultText }}
    </span>
</template>