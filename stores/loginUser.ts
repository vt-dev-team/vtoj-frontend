// stores/loginUser.ts
import { defineStore } from "pinia";
import type { VResponse } from "~/models/VReponse";

import type { VUserLoginState, VUserInfo } from "~/models/VUser";

export const useLoginUserStore = defineStore({
    id: "loginUser",
    state: (): VUserLoginState => ({
        status: 0,
        login: false,
        user: undefined
    }),
    actions: {
        // 从服务器获取配置
        async fetchUser() {
            // 从服务器获取配置
            try {
                const res: VResponse<VUserLoginState> = await $fetch("/api/user/me");
                // 如果获取成功
                if (res.status === "success") {
                    // 更新状态
                    this.status = 200;
                    this.login = res.data.login;
                    // 更新配置
                    this.user = res.data.user;
                } else {
                    // 获取失败
                    this.status = 500;
                    this.login = false;
                    this.user = undefined;
                }
            }
            catch (e) {
                this.status = 500;
                this.login = false;
                this.user = undefined;
            }
        },
        update(user: VUserInfo) {
            this.status = 200;
            this.login = true;
            this.user = user;
        },
        logout() {
            this.status = 200;
            this.login = false;
            this.user = undefined;
        }
    }
});