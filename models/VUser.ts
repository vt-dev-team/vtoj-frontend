export interface VUserInfo {
    id: number;
    username: string;
    privilege: string;
}

export interface VUserLoginState {
    status: number;
    login: boolean;
    user?: VUserInfo;
};