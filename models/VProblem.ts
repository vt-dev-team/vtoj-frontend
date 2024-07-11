export interface VProblemCreator {
    id: number;
    username: string;
    rating: number;
    tag: string;
}

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
    creator: VProblemCreator
}

export interface VProblemOutline {
    id: number;
    pid: string;
    title: string;
    difficulty: number;
    tags: string;
    judgeMethod: number;
    creator: VProblemCreator;
}

export interface VProblemSearchParam {
    page?: number;
    pageSize?: number;
    search?: string;
}