import type { Sql } from './types';
export type DbConfig = {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    ssl?: boolean;
};
export type Client = Sql & {
    end(): Promise<void>;
};
export declare const connectionUrl: (config: DbConfig) => string;
export declare const connect: (config: DbConfig) => Client;
