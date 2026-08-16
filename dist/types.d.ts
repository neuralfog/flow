export type Row = Record<string, unknown>;
export type Sql = {
    <T = Row[]>(strings: TemplateStringsArray, ...values: unknown[]): Promise<T>;
    unsafe<T = Row[]>(query: string, params?: unknown[]): Promise<T>;
};
export type JobRow = {
    id: string;
    kind: string;
    args: string;
    attempt: number;
};
export type EnqueueOptions = {
    at?: Date;
};
export type WorkerState = 'running' | 'paused' | 'draining';
