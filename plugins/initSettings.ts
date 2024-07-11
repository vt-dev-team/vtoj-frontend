// plugins/initSettings.ts

import { defineNuxtPlugin } from "#app";
import { useSettingsStore } from "~/stores/settings";
import { useLoginUserStore } from "~/stores/loginUser";

export default defineNuxtPlugin(async () => {
    const settingsStore = useSettingsStore();
    await settingsStore.fetchSettings();

    const loginUserStore = useLoginUserStore();
    await loginUserStore.fetchUser();
});