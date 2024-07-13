// plugins/initSettings.ts

import { defineNuxtPlugin } from "#app";
import { useSettingsStore } from "~/stores/settings";
import { useLoginUserStore } from "~/stores/loginUser";

export default defineNuxtPlugin({
    async setup(nuxtApp) {
        const settingsStore = useSettingsStore();
        const loginUserStore = useLoginUserStore();

        await Promise.all([
            settingsStore.fetchSettings(),
            loginUserStore.fetchUser()
        ]);
    }
});