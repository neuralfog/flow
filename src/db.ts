import type { Sql } from './types';

export type DbConfig = {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    ssl?: boolean;
};

export type Client = Sql & { end(): Promise<void> };

export const connectionUrl = (config: DbConfig): string => {
    const user = encodeURIComponent(config.user);
    const password = encodeURIComponent(config.password);
    const query = config.ssl ? '?sslmode=require' : '';
    return `postgres://${user}:${password}@${config.host}:${config.port}/${config.database}${query}`;
};

export const connect = (config: DbConfig): Client =>
    new Bun.SQL(connectionUrl(config)) as unknown as Client;
