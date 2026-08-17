export type Row = Record<string, unknown>;

export type JobRow = {
    id: string;
    kind: string;
    args: string;
    attempt: number;
    timeout: number;
};

export type EnqueueOptions = {
    at?: Date;
};

export type WorkerState = 'running' | 'paused' | 'draining';
