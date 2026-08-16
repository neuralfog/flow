export const defineJob = (name, opts = {}) => ({
    name,
    retry: {
        retryable: opts.retryable ?? false,
        attempts: opts.attempts ?? 1,
        backoff: opts.backoff ?? 0,
    },
});
