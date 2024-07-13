<template>
    <n-grid cols="4" :x-gap="20" :y-gap="12" item-responsive responsive="screen">
        <n-grid-item span="4 l:3">
            <div class="v-card">
                <div class="v-card-title-small">公告信息</div>
            </div>
            <div class="v-card">
                <div class="v-card-title-small">近期比赛</div>
            </div>
        </n-grid-item>
        <n-grid-item span="4 l:1">
            <div class="v-card">
                <div class="v-card-title-small">最近更新</div>
            </div>
        </n-grid-item>
    </n-grid>
</template>