import type { VUserOutline } from "./VUser";

export interface VProblem {        
    id: number;
    pid: string;
    title: string;
    description: string;
    difficulty: number,
    tags: string;
    judgeMethod: number;
    timeLimit: number;
    memoryLimit: number;
    creator: VUserOutline;
}

export interface VProblemOutline {
    id: number;
    pid: string;
    title: string;
    difficulty: number;
    tags: string;
    judgeMethod: number;
    creator: VUserOutline;
}

export interface VProblemSearchParam {
    page?: number;
    pageSize?: number;
    search?: string;
}