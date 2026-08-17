import { afterAll, beforeAll } from 'bun:test';
import { Client, type QueryResultRow } from 'pg';
import type { DiContainer } from '../src/container';
import type { DbConfig } from '../src/db';
import { Flow } from '../src/flow';
import type { HandlerClass } from '../src/job';
import { FlowWorker } from '../src/flow-worker';

export const CONFIG: DbConfig = {
    host: 'localhost',
    port: 5432,
    user: 'flow',
    password: 'flow',
    database: 'flow',
};

const ROOT = new URL('..', import.meta.url).pathname;

let db: Client;

const compose = (args: string[]): Promise<number> =>
    Bun.spawn(['docker', 'compose', ...args], {
        cwd: ROOT,
        stdout: 'inherit',
        stderr: 'inherit',
    }).exited;

beforeAll(async () => {
    process.setMaxListeners(0);
    await compose(['down']);
    await compose(['up', '-d', '--wait']);
    Flow.config(CONFIG);
    await Flow.migrate();
    db = new Client(CONFIG);
    await db.connect();
}, 60000);

afterAll(async () => {
    await db?.end();
    await compose(['down']);
}, 60000);

export const reset = async (): Promise<void> => {
    await db.query('truncate flow.jobs, flow.workers');
};

export const stateOf = async (id: string): Promise<string | undefined> => {
    const { rows } = await db.query<{ state: string }>(
        'select state from flow.jobs where id = $1',
        [id],
    );
    return rows[0]?.state;
};

export const jobRow = async (
    id: string,
): Promise<Record<string, unknown> | undefined> => {
    const { rows } = await db.query('select * from flow.jobs where id = $1', [
        id,
    ]);
    return rows[0];
};

export const query = async <T extends QueryResultRow = QueryResultRow>(
    sql: string,
    params: unknown[] = [],
): Promise<T[]> => {
    const { rows } = await db.query<T>(sql, params);
    return rows;
};

export const waitFor = async (
    predicate: () => Promise<boolean>,
    timeout = 15000,
): Promise<boolean> => {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
        if (await predicate()) return true;
        await Bun.sleep(50);
    }
    return false;
};

export const waitState = (
    id: string,
    state: string,
    timeout = 15000,
): Promise<boolean> =>
    waitFor(async () => (await stateOf(id)) === state, timeout);

export const container: DiContainer = {
    scope() {
        return this;
    },
    noHttp() {
        return this;
    },
    get(Handler: new () => unknown) {
        return new Handler();
    },
    value() {
        return this;
    },
    dispose() {},
} as unknown as DiContainer;

export type WorkerHandle = { worker: FlowWorker; loop: Promise<void> };

export const spawnWorker = (
    id: string,
    handlers: HandlerClass[],
): WorkerHandle => {
    const worker = new FlowWorker({ id, config: CONFIG, container, handlers });
    const started = worker.start();
    started.catch(() => undefined);
    return { worker, loop: started };
};

export const stopHandle = async (handle: WorkerHandle): Promise<void> => {
    await handle.worker.stop().catch(() => undefined);
    await handle.loop.catch(() => undefined);
};

let active: WorkerHandle | null = null;

export const startWorker = (
    handlers: HandlerClass[],
    id = 'test-worker',
): void => {
    active = spawnWorker(id, handlers);
};

export const stopWorker = async (): Promise<void> => {
    if (active === null) return;
    await stopHandle(active);
    active = null;
};

export const uuid = (): string => crypto.randomUUID();
