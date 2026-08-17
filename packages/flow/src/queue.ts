import { connect, type Db, type DbConfig } from './db';
import type { JobContract } from './job';
import type { EnqueueOptions } from './types';

export class Queue {
    private readonly db: Db;

    constructor(config: DbConfig) {
        this.db = connect(config);
    }

    async enqueue<A>(
        contract: JobContract<A>,
        args: A,
        options: EnqueueOptions = {},
    ): Promise<string> {
        const at = options.at ?? new Date();
        const r = contract.retry;
        const timeout = contract.timeout > 0 ? contract.timeout : null;
        const { rows } = await this.db.query<{ id: string }>(
            'select flow.enqueue($1, $2, $3, $4, $5, $6, $7) as id',
            [
                contract.name,
                JSON.stringify(args),
                at,
                r.retryable,
                r.attempts,
                r.backoff,
                timeout,
            ],
        );
        return rows[0].id;
    }

    async schedule<A>(
        contract: JobContract<A>,
        args: A,
        seconds: number,
        at: Date,
    ): Promise<void> {
        const r = contract.retry;
        const timeout = contract.timeout > 0 ? contract.timeout : null;
        await this.db.query(
            'select flow.schedule($1, $2, $3, $4::int, $5, $6, $7, $8)',
            [
                contract.name,
                JSON.stringify(args),
                at,
                seconds,
                r.retryable,
                r.attempts,
                r.backoff,
                timeout,
            ],
        );
    }

    async reconcile(): Promise<number> {
        const { rows } = await this.db.query<{ count: string }>(
            'select flow.reconcile() as count',
        );
        return Number(rows[0].count);
    }

    close(): Promise<void> {
        return this.db.end();
    }
}
