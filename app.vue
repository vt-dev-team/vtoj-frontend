<script setup lang="ts">
import { NNotificationProvider } from 'naive-ui';
import { useSettingsStore } from './stores/settings';

const router = useRouter();
const settingsStore = useSettingsStore();

if (settingsStore.status !== 200) {
    router.push({ name: 'error', query: { code: settingsStore.status, title: 'error.unable_to_connect_server', message: settingsStore.errorMessage } });
}
</script>

<template>
    <div>
        <NuxtRouteAnnouncer />
        <n-notification-provider>
            <Navbar />
            <div class="v-container" id="vtoj-app">
                <NuxtPage />
            </div>
            <Footer />
        </n-notification-provider>
    </div>
</template>
