import { connect, type Db, type DbConfig } from './db';
import type { Row } from './types';

export class Inspector {
    private readonly db: Db;

    constructor(config: DbConfig) {
        this.db = connect(config);
    }

    async workers(): Promise<Row[]> {
        const { rows } = await this.db.query(
            'select * from flow.list_workers()',
        );
        return rows;
    }

    async pending(): Promise<Row[]> {
        const { rows } = await this.db.query('select * from flow.pending()');
        return rows;
    }

    async failed(): Promise<Row[]> {
        const { rows } = await this.db.query('select * from flow.failed()');
        return rows;
    }

    close(): Promise<void> {
        return this.db.end();
    }
}
