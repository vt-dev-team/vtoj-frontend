import type { VUserOutline } from "./VUser";

export interface VContestOutline {
    id: number,
    title: string,
    isPublic: boolean,
    mode: number,
    startTime: Date,
    endTime: Date
}

export interface VContestBasicInfo {
    id: number;
    title: string;
    description: string;
    isPublic: boolean;
    mode: number;
    startTime: Date;
    endTime: Date;
    creator: VUserOutline;
}