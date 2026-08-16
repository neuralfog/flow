import type { Container } from './container';
import type { DbConfig } from './db';
import { type Duration } from './duration';
import { Inspector } from './Inspector';
import type { HandlerClass, JobContract } from './job';
export type WorkOptions = {
    id: string;
    container: Container;
    poll?: number;
};
export type AddOptions = {
    in?: Duration;
    at?: Date;
};
export type ScheduleOptions = {
    every: Duration;
    at?: string;
};
declare class FlowRuntime {
    private dbConfig;
    private readonly handlers;
    private queue;
    private worker;
    config(config: DbConfig): void;
    jobs(handlers: HandlerClass[]): void;
    add<A>(contract: JobContract<A>, args: A, options?: AddOptions): Promise<string>;
    schedule<A>(contract: JobContract<A>, args: A, options: ScheduleOptions): Promise<void>;
    reconcile(): Promise<number>;
    migrate(): Promise<string[]>;
    inspector(): Inspector;
    work(options: WorkOptions): Promise<void>;
    stop(): Promise<void>;
    private producer;
    private require;
}
export declare const Flow: FlowRuntime;
export {};
