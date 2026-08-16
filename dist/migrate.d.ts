import { type DbConfig } from './db';
export declare const migrate: (config: DbConfig, from?: string) => Promise<string[]>;
