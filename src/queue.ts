import { type Client, connect, type DbConfig } from './db';
import type { JobContract } from './job';
import type { EnqueueOptions } from './types';

export class Queue {
    private readonly sql: Client;

    constructor(config: DbConfig) {
        this.sql = connect(config);
    }

    async enqueue<A>(
        contract: JobContract<A>,
        args: A,
        options: EnqueueOptions = {},
    ): Promise<string> {
        const at = options.at ?? new Date();
        const r = contract.retry;
        const timeout = contract.timeout > 0 ? contract.timeout : null;
        const rows = await this.sql<{ id: string }[]>`
            select flow.enqueue(
                ${contract.name},
                ${JSON.stringify(args)},
                ${at},
                ${r.retryable},
                ${r.attempts},
                ${r.backoff},
                ${timeout}
            ) as id`;
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
        await this.sql`
            select flow.schedule(
                ${contract.name},
                ${JSON.stringify(args)},
                ${at},
                ${seconds}::int,
                ${r.retryable},
                ${r.attempts},
                ${r.backoff},
                ${timeout}
            )`;
    }

    async reconcile(): Promise<number> {
        const rows = await this.sql<{ count: string }[]>`
            select flow.reconcile() as count`;
        return Number(rows[0].count);
    }

    close(): Promise<void> {
        return this.sql.end();
    }
}
