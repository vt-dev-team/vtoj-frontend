export interface VUserInfo {
    id: number;
    username: string;
    privilege: string;
}

export interface VUserLoginState {
    login: boolean;
    user?: VUserInfo;
};