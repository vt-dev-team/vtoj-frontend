<template>
    <a-row :gutter="20">
        <a-col :md="{ span: 18, order: 1 }" :sm="{ span: 24, order: 2 }" :xs="{ span: 24, order: 2 }">
            <slot name="left"></slot>
        </a-col>
        <a-col :md="{ span: 6, order: 2 }" :sm="{ span: 24, order: 1 }" :xs="{ span: 24, order: 2 }">
            <slot name="right"></slot>
        </a-col>
    </a-row>
</template>