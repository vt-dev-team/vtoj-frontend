<script setup lang="ts">
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
        <Navbar />
        <div class="v-container" id="vtoj-app">
            <NuxtPage />
        </div>
        <Footer />
    </div>
</template>
