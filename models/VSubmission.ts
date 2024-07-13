interface VSubmissionSubmitter {
    id: number;
    name: string;
    rating: number;
    tag: string;
}

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
    submitTime: Date;
    judgeTime: Date;
    judgeMachine: string;
    submitter: VSubmissionSubmitter;
    problem: VSubmissionProblem;
    contest: VSubmissionContest;
    domain: VSubmissionDomain;
}