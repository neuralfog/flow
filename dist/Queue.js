import { connect } from './db';
export class Queue {
    constructor(config) {
        Object.defineProperty(this, "sql", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.sql = connect(config);
    }
    async enqueue(contract, args, options = {}) {
        const at = options.at ?? new Date();
        const r = contract.retry;
        const rows = await this.sql `
            select flow.enqueue(
                ${contract.name},
                ${JSON.stringify(args)},
                ${at},
                ${r.retryable},
                ${r.attempts},
                ${r.backoff}
            ) as id`;
        return rows[0].id;
    }
    async schedule(contract, args, seconds, at) {
        const r = contract.retry;
        await this.sql `
            select flow.schedule(
                ${contract.name},
                ${JSON.stringify(args)},
                ${at},
                ${seconds}::int,
                ${r.retryable},
                ${r.attempts},
                ${r.backoff}
            )`;
    }
    async reconcile() {
        const rows = await this.sql `
            select flow.reconcile() as count`;
        return Number(rows[0].count);
    }
    close() {
        return this.sql.end();
    }
}
