import { Client as PgClient } from 'pg';
import type { DiContainer } from './container';
import { type Client, connect, type DbConfig } from './db';
import type { HandlerClass, JobHandler } from './job';
import { type Registry, register } from './registry';
import type { JobRow, WorkerState } from './types';

type Waiter = {
    resolve: () => void;
    timer: ReturnType<typeof setTimeout> | null;
};

class TimeoutError extends Error {}

export class FlowWorker {
    private running = false;
    private current: Promise<boolean> | null = null;
    private sql: Client | null = null;
    private notifier: PgClient | null = null;
    private waiter: Waiter | null = null;
    private pending = false;
    private uuid: string | null = null;
    private pingTimer: ReturnType<typeof setInterval> | null = null;
    private reconnecting = false;
    private readonly registry: Registry;
    private readonly bootId = Bun.randomUUIDv7();

    constructor(private readonly options: FlowWorkerOptions) {
        this.registry = register(options.handlers);
    }

    async start(): Promise<void> {
        if (this.running) return;
        this.sql = connect(this.options.config);
        this.running = true;
        await this.register();
        await this.subscribe();
        this.install();
        await this.loop();
    }

    async stop(): Promise<void> {
        this.running = false;
        this.wake();
        this.stopPing();
        await this.closeNotifier();
        if (this.current) await this.current;
        if (this.sql === null) return;
        await this.sql.end();
        this.sql = null;
    }

    private get db(): Client {
        if (this.sql === null) throw new Error('flow: worker is not running');
        return this.sql;
    }

    private install(): void {
        const shutdown = (): void => {
            void this.stop();
        };
        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);
    }

    private async subscribe(): Promise<void> {
        const c = this.options.config;
        const notifier = new PgClient({
            host: c.host,
            port: c.port,
            user: c.user,
            password: c.password,
            database: c.database,
            ssl: c.ssl,
            application_name: `flow:worker:${this.options.id}:${this.bootId}`,
            keepAlive: true,
        });
        notifier.on('notification', () => this.wake());
        notifier.on('error', () => {
            void this.resubscribe();
        });
        notifier.on('end', () => {
            void this.resubscribe();
        });
        await notifier.connect();
        await notifier.query('listen flow');
        this.notifier = notifier;
        this.startPing();
    }

    private async resubscribe(): Promise<void> {
        if (this.reconnecting || !this.running) return;
        this.reconnecting = true;
        this.stopPing();
        await this.closeNotifier();
        let attempt = 0;
        while (this.running) {
            try {
                await this.subscribe();
                break;
            } catch {
                attempt += 1;
                await this.sleep(Math.min(30_000, 2 ** attempt * 100));
            }
        }
        this.reconnecting = false;
        if (!this.running) {
            this.stopPing();
            await this.closeNotifier();
            return;
        }
        this.wake();
    }

    private startPing(): void {
        this.stopPing();
        this.pingTimer = setInterval(() => {
            void this.ping();
        }, 10_000);
    }

    private stopPing(): void {
        if (this.pingTimer !== null) {
            clearInterval(this.pingTimer);
            this.pingTimer = null;
        }
    }

    private async ping(): Promise<void> {
        if (this.notifier === null) return;
        try {
            await this.notifier.query('select 1');
        } catch {
            void this.resubscribe();
        }
    }

    private async closeNotifier(): Promise<void> {
        const notifier = this.notifier;
        this.notifier = null;
        if (notifier !== null) {
            notifier.removeAllListeners();
            await notifier.end().catch(() => undefined);
        }
    }

    private sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    private wake(): void {
        const w = this.waiter;
        if (w !== null) {
            this.waiter = null;
            if (w.timer !== null) clearTimeout(w.timer);
            w.resolve();
        } else {
            this.pending = true;
        }
    }

    private waitForWork(ms: number | null): Promise<void> {
        if (this.pending) {
            this.pending = false;
            return Promise.resolve();
        }
        if (ms !== null && ms <= 0) return Promise.resolve();
        return new Promise((resolve) => {
            const timer =
                ms === null
                    ? null
                    : setTimeout(() => {
                          if (this.waiter !== null) {
                              this.waiter = null;
                              resolve();
                          }
                      }, ms);
            this.waiter = { resolve, timer };
        });
    }

    private async nextWait(): Promise<number | null> {
        const rows = await this.db<{ next: Date | null }[]>`
            select flow.next_run() as next`;
        const next = rows[0]?.next;
        if (!next) return null;
        return Math.max(0, new Date(next).getTime() - Date.now());
    }

    private async loop(): Promise<void> {
        while (this.running) {
            const state = await this.desiredState();
            if (state === 'draining') {
                await this.stop();
                return;
            }
            if (state === 'paused') {
                await this.waitForWork(null);
                continue;
            }
            this.current = this.tick();
            const claimed = await this.current;
            this.current = null;
            if (!claimed && this.running) {
                await this.waitForWork(await this.nextWait());
            }
        }
    }

    private async tick(): Promise<boolean> {
        const row = await this.claim();
        if (row === null) return false;
        await this.run(row);
        return true;
    }

    private async run(row: JobRow): Promise<void> {
        const handlerClass = this.registry.get(row.kind);
        if (handlerClass === undefined) {
            throw new Error(`flow: no handler registered for '${row.kind}'`);
        }
        const scope = this.options.container.scope().noHttp();
        await this.busy(row.id);
        const controller = new AbortController();
        try {
            const instance = scope.get<JobHandler<unknown>>(handlerClass);
            const work = Promise.resolve(
                instance.run(JSON.parse(row.args), {
                    id: row.id,
                    attempt: row.attempt,
                    scope,
                    signal: controller.signal,
                }),
            );
            await this.execute(work, row.timeout, controller);
            await this.complete(row);
        } catch (error) {
            await this.fail(row, error);
        } finally {
            const disposal = scope.dispose();
            if (disposal) await disposal;
            await this.idle();
        }
    }

    private execute(
        work: Promise<void>,
        ms: number,
        controller: AbortController,
    ): Promise<void> {
        if (ms <= 0) return work;
        return new Promise<void>((resolve, reject) => {
            const timer = setTimeout(() => {
                controller.abort();
                reject(new TimeoutError(`flow: job timed out after ${ms}ms`));
            }, ms);
            work.then(
                () => {
                    clearTimeout(timer);
                    resolve();
                },
                (error) => {
                    clearTimeout(timer);
                    reject(error);
                },
            );
        });
    }

    private async claim(): Promise<JobRow | null> {
        const rows = await this.db<
            JobRow[]
        >`select * from flow.claim(${this.uuid}, ${this.bootId})`;
        return rows[0] ?? null;
    }

    private async complete(row: JobRow): Promise<void> {
        await this.db`select flow.complete(${row.id}, ${this.options.id})`;
    }

    private async fail(row: JobRow, error: unknown): Promise<void> {
        const message =
            error instanceof Error
                ? (error.stack ?? error.message)
                : String(error);
        const terminal = error instanceof TimeoutError ? 'timed_out' : 'failed';
        await this.db`select flow.fail(${row.id}, ${message}, ${terminal})`;
    }

    private async register(): Promise<void> {
        const rows = await this.db<{ id: string }[]>`
            select flow.register(${this.options.id}, ${this.bootId}) as id`;
        this.uuid = rows[0].id;
    }

    private async busy(job: string): Promise<void> {
        await this.db`select flow.busy(${this.options.id}, ${job})`;
    }

    private async idle(): Promise<void> {
        await this.db`select flow.idle(${this.options.id})`;
    }

    private async desiredState(): Promise<WorkerState> {
        const rows = await this.db<{ desired_state: WorkerState }[]>`
            select flow.desired_state(${this.options.id}) as desired_state`;
        return rows[0]?.desired_state ?? 'running';
    }
}

export type FlowWorkerOptions = {
    id: string;
    config: DbConfig;
    container: DiContainer;
    handlers: HandlerClass[];
};
