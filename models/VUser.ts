export interface VUserInfo {
    id: number;
    username: string;
    privilege: string;
};

export interface VUserLoginState {
    status: number;
    login: boolean;
    user?: VUserInfo;
};

export interface VUserOutline {
    id: number;
    username: string;
    rating: number;
    tag: string;
};