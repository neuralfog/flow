import type { Container } from './container';
export type JobContext = {
    id: string;
    attempt: number;
    scope: Container;
};
export type RetryPolicy = {
    retryable?: boolean;
    attempts?: number;
    backoff?: number;
};
export type JobContract<A> = {
    readonly name: string;
    readonly retry: Required<RetryPolicy>;
    readonly __args?: A;
};
export declare const defineJob: <A>(name: string, opts?: RetryPolicy) => JobContract<A>;
export type JobHandler<A> = {
    run(args: A, ctx: JobContext): void | Promise<void>;
};
export type HandlerClass = (new (...args: any[]) => JobHandler<any>) & {
    readonly job: JobContract<any>;
};
