<script setup lang="ts">
import { HourglassOutlined, CloseOutlined, CheckOutlined, ClockCircleOutlined, DatabaseOutlined, SettingOutlined } from '@ant-design/icons-vue';

const props = defineProps<{
    result: number;
}>();

const statusCode = [
    ['Pending', 'blue', HourglassOutlined],
    ['Pending Rejudge', 'blue', HourglassOutlined],
    ['Judging', 'blue', HourglassOutlined],
    ['Accepted', 'green', CheckOutlined],
    ['Wrong Answer', 'red', CloseOutlined],
    ['Time Limit Exceeded', 'yellow', ClockCircleOutlined],
    ['Memory Limit Exceeded', 'purple', DatabaseOutlined],
    ['Output Limit Exceeded', 'red', CloseOutlined],
    ['Runtime Error', 'red', CloseOutlined],
    ['Unknown Error', 'red', CloseOutlined],
    ['System Error', 'red', SettingOutlined],
    ['Unaccepted', 'red', CloseOutlined]
];

const resultText = statusCode[props.result][0];
const resultColor = statusCode[props.result][1];
const resultIcon = statusCode[props.result][2];
</script>

<template>
    <span class="v-result" :class="resultColor">
        <resultIcon />
        {{ resultText }}
    </span>
</template>