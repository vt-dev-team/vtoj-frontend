import type { VUserOutline } from "./VUser";

interface VSubmissionContest {
    id: number;
    title: string;
    mode: number;
    startTime: Date;
    endTime: Date;
}

interface VSubmissionDomain {
    id: number;
    name: string;
}

interface VSubmissionProblem {
    id: number;
    pid: string;
    title: string;
}

export interface VSubmission {
    id: number;
    codeText: string;
    language: number;
    result: number;
    score: number;
    info: string;
    timeCost: number;
    memoryCost: number;
    problem: VSubmissionProblem;
    contest: VSubmissionContest;
    domain: VSubmissionDomain;
    submitter: VUserOutline;
    submitTime: Date;
    judgeTime: Date;
    judgeMachine: string;
}

export interface VSubmissionOutline {
    id: number;
    result: number;
    score: number;
    timeCost: number;
    memoryCost: number;
    submitter: VUserOutline;
    problem: VSubmissionProblem;
    submitTime: Date;
    judgeTime: Date;
    judgeMachine: string;
}