import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { Flow } from '../src/flow';
import { defineJob, type JobContext } from '../src/job';
import {
    jobRow,
    reset,
    startWorker,
    stateOf,
    stopWorker,
    waitState,
} from './harness';

beforeEach(reset);
afterEach(stopWorker);

describe('retry', () => {
    it('climbs attempts, gates re-runs by backoff, then fails when exhausted', async () => {
        const runs: number[] = [];
        const Boom = defineJob('retry-boom', {
            retryable: true,
            attempts: 3,
            backoff: 300,
        });
        class BoomHandler {
            static job = Boom;
            async run(_args: unknown, ctx: JobContext): Promise<void> {
                runs.push(Date.now());
                throw new Error(`kaboom on attempt ${ctx.attempt}`);
            }
        }

        startWorker([BoomHandler], 'retry-worker');

        const id = await Flow.add(Boom, {});
        const done = await waitState(id, 'failed');
        expect(done).toBe(true);

        const row = await jobRow(id);
        expect(row?.attempt).toBe(3);
        expect(row?.state).toBe('failed');
        expect(String(row?.last_error)).toContain('kaboom');

        expect(runs.length).toBe(3);
        expect(runs[1] - runs[0]).toBeGreaterThanOrEqual(250);
        expect(runs[2] - runs[1]).toBeGreaterThanOrEqual(250);
    }, 20000);

    it('sends a non-retryable job straight to failed after one throw', async () => {
        let calls = 0;
        const Once = defineJob('once-boom');
        class OnceHandler {
            static job = Once;
            async run(): Promise<void> {
                calls += 1;
                throw new Error('nope');
            }
        }

        startWorker([OnceHandler], 'once-worker');

        const id = await Flow.add(Once, {});
        const done = await waitState(id, 'failed');
        expect(done).toBe(true);

        const row = await jobRow(id);
        expect(row?.attempt).toBe(1);
        expect(String(row?.last_error)).toContain('nope');

        await Bun.sleep(500);
        expect(calls).toBe(1);
        expect(await stateOf(id)).toBe('failed');
    }, 20000);

    it('treats retryable with a single attempt as non-retryable', async () => {
        let calls = 0;
        const Deg = defineJob('degenerate-retry', {
            retryable: true,
            attempts: 1,
        });
        class DegHandler {
            static job = Deg;
            async run(): Promise<void> {
                calls += 1;
                throw new Error('once');
            }
        }

        startWorker([DegHandler], 'degenerate-worker');

        const id = await Flow.add(Deg, {});
        const done = await waitState(id, 'failed');
        expect(done).toBe(true);

        await Bun.sleep(400);
        const row = await jobRow(id);
        expect(row?.attempt).toBe(1);
        expect(calls).toBe(1);
    }, 20000);
});
