import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { Client } from 'pg';
import { Flow } from '../src/flow';
import { defineJob } from '../src/job';
import {
    CONFIG,
    query,
    reset,
    startWorker,
    stateOf,
    stopWorker,
    uuid,
} from './harness';

beforeEach(reset);
afterEach(stopWorker);

describe('dead worker', () => {
    it('marks a job left running by a dead worker as failed, spares a live one, and never re-runs it', async () => {
        const deadBoot = uuid();
        const liveBoot = uuid();

        const live = new Client({
            ...CONFIG,
            application_name: `flow:worker:live-worker:${liveBoot}`,
        });
        await live.connect();

        try {
            const [dead] = await query<{ id: string }>(
                `insert into flow.jobs (kind, args, state, worker_boot_id)
                 values ('dead-job', '{}', 'running', $1) returning id`,
                [deadBoot],
            );
            const [alive] = await query<{ id: string }>(
                `insert into flow.jobs (kind, args, state, worker_boot_id)
                 values ('live-job', '{}', 'running', $1) returning id`,
                [liveBoot],
            );

            const marked = await Flow.reconcile();
            expect(marked).toBe(1);

            const deadRow = await query<{ state: string; last_error: string }>(
                'select state, last_error from flow.jobs where id = $1',
                [dead.id],
            );
            expect(deadRow[0].state).toBe('failed');
            expect(deadRow[0].last_error).toBe('worker died mid-job');

            expect(await stateOf(alive.id)).toBe('running');

            let reran = false;
            class DeadHandler {
                static job = defineJob('dead-job');
                async run(): Promise<void> {
                    reran = true;
                }
            }
            startWorker([DeadHandler], 'reconcile-worker');

            await Bun.sleep(600);
            expect(reran).toBe(false);
            expect(await stateOf(dead.id)).toBe('failed');
        } finally {
            await live.end();
        }
    }, 20000);
});
