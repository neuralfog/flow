import type { HandlerClass } from './job';
export type Registry = Map<string, HandlerClass>;
export declare const register: (handlers: HandlerClass[]) => Registry;
