import { type Client, connect, type DbConfig } from './db';
import type { Row } from './types';

export class Inspector {
    private readonly sql: Client;

    constructor(config: DbConfig) {
        this.sql = connect(config);
    }

    workers(): Promise<Row[]> {
        return this.sql<Row[]>`select * from flow.list_workers()`;
    }

    pending(): Promise<Row[]> {
        return this.sql<Row[]>`select * from flow.pending()`;
    }

    failed(): Promise<Row[]> {
        return this.sql<Row[]>`select * from flow.failed()`;
    }

    close(): Promise<void> {
        return this.sql.end();
    }
}
