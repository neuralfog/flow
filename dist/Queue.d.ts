import { type DbConfig } from './db';
import type { JobContract } from './job';
import type { EnqueueOptions } from './types';
export declare class Queue {
    private readonly sql;
    constructor(config: DbConfig);
    enqueue<A>(contract: JobContract<A>, args: A, options?: EnqueueOptions): Promise<string>;
    schedule<A>(contract: JobContract<A>, args: A, seconds: number, at: Date): Promise<void>;
    reconcile(): Promise<number>;
    close(): Promise<void>;
}
