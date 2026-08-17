import { Pool, type QueryResultRow } from 'pg';
import { db } from '#src/config/db';

export class DbClient {
    private readonly pool: Pool;

    constructor() {
        this.pool = new Pool({
            host: db.host,
            port: db.port,
            user: db.user,
            password: db.password,
            database: db.database,
            ssl: db.ssl ? { rejectUnauthorized: false } : undefined,
        });
        console.log('[PG] Connection pool created');
    }

    async query<T extends QueryResultRow = QueryResultRow>(
        text: string,
        params: unknown[] = [],
    ): Promise<T[]> {
        const { rows } = await this.pool.query<T>(
            text,
            params.length ? params : undefined,
        );
        return rows;
    }

    async ping(): Promise<boolean> {
        const rows = await this.query<{ ping: number }>('select 1 as ping');
        return rows[0]?.ping === 1;
    }

    dispose(): Promise<void> {
        return this.pool.end();
    }
}
