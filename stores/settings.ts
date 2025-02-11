// stores/settings.ts
import { defineStore } from "pinia";
import { VFetchError, type VResponse } from "~/models/VReponse";

import type { VWebsiteSettings, VUISettings, VSettings } from "~/models/VSettings";

export const useSettingsStore = defineStore({
    id: "settings",
    state: (): VSettings => ({
        website: {
            title: "Vegetable OJ"
        } as VWebsiteSettings,
        ui: {} as VUISettings,
        status: 0,
    }),
    actions: {
        // 从服务器获取配置
        async fetchSettings() {
            // 从服务器获取配置
            try {
                const res: VResponse<VSettings> = await $fetch("/api/base/settings");
                // 如果获取成功
                if (res.status === "success") {
                    // 更新状态
                    this.status = 200;
                    // 更新配置
                    this.website = res.data.website;
                    this.ui = res.data.ui;
                } else {
                    // 获取失败
                    this.status = res.error?.code || 500;
                    this.errorMessage = res.error?.message || "出现了错误";
                    throw new VFetchError(this.status, this.errorMessage);
                }
            }
            catch (e: any) {
                this.status = e.code || 500;
                this.errorMessage = e.message || "出现了错误";
            }
        }
    }
});