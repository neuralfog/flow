export const register = (handlers) => {
    const map = new Map();
    for (const handler of handlers)
        map.set(handler.job.name, handler);
    return map;
};
