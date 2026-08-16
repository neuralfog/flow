import { Client as PgClient } from 'pg';
import { connect } from './db';
export class Worker {
    constructor(options) {
        Object.defineProperty(this, "options", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: options
        });
        Object.defineProperty(this, "running", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "current", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "sql", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "notifier", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "waiter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "pending", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "uuid", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "bootId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: Bun.randomUUIDv7()
        });
    }
    async start() {
        if (this.running)
            return;
        this.sql = connect(this.options.config);
        this.running = true;
        await this.register();
        await this.subscribe();
        this.install();
        await this.loop();
    }
    async stop() {
        this.running = false;
        this.wake();
        if (this.notifier !== null) {
            await this.notifier.end().catch(() => undefined);
            this.notifier = null;
        }
        if (this.current)
            await this.current;
        if (this.sql === null)
            return;
        await this.sql.end();
        this.sql = null;
    }
    get db() {
        if (this.sql === null)
            throw new Error('flow: worker is not running');
        return this.sql;
    }
    install() {
        const shutdown = () => {
            void this.stop();
        };
        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);
    }
    async subscribe() {
        const c = this.options.config;
        const notifier = new PgClient({
            host: c.host,
            port: c.port,
            user: c.user,
            password: c.password,
            database: c.database,
            ssl: c.ssl,
            application_name: `flow:worker:${this.options.id}:${this.bootId}`,
        });
        notifier.on('notification', () => this.wake());
        notifier.on('error', () => {
            void this.resubscribe();
        });
        await notifier.connect();
        await notifier.query('listen flow');
        this.notifier = notifier;
    }
    async resubscribe() {
        if (!this.running)
            return;
        await this.notifier?.end().catch(() => undefined);
        this.notifier = null;
        if (this.running)
            await this.subscribe().catch(() => undefined);
    }
    wake() {
        const w = this.waiter;
        if (w !== null) {
            this.waiter = null;
            clearTimeout(w.timer);
            w.resolve();
        }
        else {
            this.pending = true;
        }
    }
    waitForWork(ms) {
        if (this.pending) {
            this.pending = false;
            return Promise.resolve();
        }
        if (ms <= 0)
            return Promise.resolve();
        return new Promise((resolve) => {
            const timer = setTimeout(() => {
                if (this.waiter !== null) {
                    this.waiter = null;
                    resolve();
                }
            }, ms);
            this.waiter = { resolve, timer };
        });
    }
    async nextWait(cap) {
        const rows = await this.db `
            select flow.next_run() as next`;
        const next = rows[0]?.next;
        if (!next)
            return cap;
        const delta = new Date(next).getTime() - Date.now();
        return Math.max(0, Math.min(delta, cap));
    }
    async loop() {
        const cap = this.options.poll ?? 30_000;
        while (this.running) {
            const state = await this.desiredState();
            if (state === 'draining') {
                await this.stop();
                return;
            }
            if (state === 'paused') {
                await this.waitForWork(cap);
                continue;
            }
            const row = await this.claim();
            if (row === null) {
                await this.waitForWork(await this.nextWait(cap));
                continue;
            }
            this.current = this.run(row);
            await this.current;
            this.current = null;
        }
    }
    async run(row) {
        const scope = this.options.container.scope().noHttp();
        await this.busy(row.id);
        try {
            const handlerClass = this.options.handlers.get(row.kind);
            if (handlerClass === undefined) {
                await this.release(row);
                return;
            }
            const instance = scope.get(handlerClass);
            await instance.run(JSON.parse(row.args), {
                id: row.id,
                attempt: row.attempt,
                scope,
            });
            await this.complete(row);
        }
        catch (error) {
            await this.fail(row, error);
        }
        finally {
            const disposal = scope.dispose();
            if (disposal)
                await disposal;
            await this.idle();
        }
    }
    async claim() {
        const rows = await this.db `select * from flow.claim(${this.uuid}, ${this.bootId})`;
        return rows[0] ?? null;
    }
    async complete(row) {
        await this.db `select flow.complete(${row.id}, ${this.options.id})`;
    }
    async fail(row, error) {
        const message = error instanceof Error
            ? (error.stack ?? error.message)
            : String(error);
        await this.db `select flow.fail(${row.id}, ${message})`;
    }
    async release(row) {
        await this.db `select flow.release(${row.id})`;
    }
    async register() {
        const rows = await this.db `
            select flow.register(${this.options.id}, ${this.bootId}) as id`;
        this.uuid = rows[0].id;
    }
    async busy(job) {
        await this.db `select flow.busy(${this.options.id}, ${job})`;
    }
    async idle() {
        await this.db `select flow.idle(${this.options.id})`;
    }
    async desiredState() {
        const rows = await this.db `
            select flow.desired_state(${this.options.id}) as desired_state`;
        return rows[0]?.desired_state ?? 'running';
    }
}
