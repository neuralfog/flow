import type { HandlerClass } from './job';

export type Registry = Map<string, HandlerClass>;

export const register = (handlers: HandlerClass[]): Registry => {
    const map: Registry = new Map();
    for (const handler of handlers) map.set(handler.job.name, handler);
    return map;
};
