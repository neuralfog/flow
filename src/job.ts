import type { DiContainer } from './container';

export type JobContext = {
    id: string;
    attempt: number;
    scope: DiContainer;
    signal: AbortSignal;
};

export type RetryPolicy = {
    retryable?: boolean;
    attempts?: number;
    backoff?: number;
};

export type JobOptions = RetryPolicy & {
    timeout?: number;
};

export type JobContract<A> = {
    readonly name: string;
    readonly retry: Required<RetryPolicy>;
    readonly timeout: number;
    readonly __args?: A;
};

export const defineJob = <A>(
    name: string,
    opts: JobOptions = {},
): JobContract<A> => ({
    name,
    retry: {
        retryable: opts.retryable ?? false,
        attempts: opts.attempts ?? 1,
        backoff: opts.backoff ?? 0,
    },
    timeout: opts.timeout ?? 0,
});

export type JobHandler<A> = {
    run(args: A, ctx: JobContext): void | Promise<void>;
};

export type HandlerClass = (new (
    ...args: any[]
) => JobHandler<any>) & {
    readonly job: JobContract<any>;
};
