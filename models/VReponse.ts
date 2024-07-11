export interface VSuccessResponse<T> {
    status: "success";
    data: T;
    meta: {
        timestamp: string;
        requestId: string;
    }
}

export interface VErrorResponse {
    status: "error";
    error: {
        code: number;
        message: string;
    };
    meta: {
        timestamp: string;
        requestId: string;
    }
}

export type VResponse<T> = VSuccessResponse<T> | VErrorResponse;