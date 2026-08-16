import { type DbConfig } from './db';
import type { Row } from './types';
export declare class Inspector {
    private readonly sql;
    constructor(config: DbConfig);
    workers(): Promise<Row[]>;
    pending(): Promise<Row[]>;
    failed(): Promise<Row[]>;
    close(): Promise<void>;
}
