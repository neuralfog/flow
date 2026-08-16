import { beforeEach, describe, expect, it } from 'bun:test';
import { Flow } from '../src/flow';
import { defineJob, type JobContext } from '../src/job';
import { jobRow, reset, spawnWorker, stopHandle, waitState } from './harness';

beforeEach(reset);

const hang = (): Promise<void> => new Promise<void>(() => {});

describe('job timeout', () => {
    it('fails a hung job and frees the worker to keep going', async () => {
        const Hang = defineJob('hang-job', { timeout: 300 });
        class HangHandler {
            static job = Hang;
            async run(): Promise<void> {
                await hang();
            }
        }
        let nextRan = false;
        const Next = defineJob('after-hang');
        class NextHandler {
            static job = Next;
            async run(): Promise<void> {
                nextRan = true;
            }
        }

        const handle = spawnWorker('timeout-worker', [
            HangHandler,
            NextHandler,
        ]);
        const hungId = await Flow.add(Hang, {});
        const nextId = await Flow.add(Next, {});

        expect(await waitState(hungId, 'timed_out')).toBe(true);
        const row = await jobRow(hungId);
        expect(String(row?.last_error)).toContain('timed out after 300ms');

        expect(await waitState(nextId, 'completed')).toBe(true);
        expect(nextRan).toBe(true);

        await stopHandle(handle);
    }, 20000);

    it('stores the 1-minute default timeout when the contract sets none', async () => {
        const Plain = defineJob('plain-timeout');
        const id = await Flow.add(Plain, {});
        const row = await jobRow(id);
        expect(row?.timeout).toBe(60000);
    });

    it('stores the contract timeout on the job row', async () => {
        const Custom = defineJob('custom-timeout', { timeout: 5000 });
        const id = await Flow.add(Custom, {});
        const row = await jobRow(id);
        expect(row?.timeout).toBe(5000);
    });

    it('retries a retryable job that times out', async () => {
        let attempts = 0;
        const Hang = defineJob('hang-retry', {
            timeout: 200,
            retryable: true,
            attempts: 2,
            backoff: 100,
        });
        class HangHandler {
            static job = Hang;
            async run(): Promise<void> {
                attempts += 1;
                await hang();
            }
        }

        const handle = spawnWorker('retry-timeout-worker', [HangHandler]);
        const id = await Flow.add(Hang, {});

        expect(await waitState(id, 'timed_out')).toBe(true);
        expect(attempts).toBe(2);
        const row = await jobRow(id);
        expect(row?.attempt).toBe(2);

        await stopHandle(handle);
    }, 20000);

    it('aborts ctx.signal when the job times out', async () => {
        let aborted = false;
        const Hang = defineJob('hang-signal', { timeout: 200 });
        class HangHandler {
            static job = Hang;
            async run(_args: unknown, ctx: JobContext): Promise<void> {
                ctx.signal.addEventListener('abort', () => {
                    aborted = true;
                });
                await hang();
            }
        }

        const handle = spawnWorker('signal-worker', [HangHandler]);
        const id = await Flow.add(Hang, {});

        expect(await waitState(id, 'timed_out')).toBe(true);
        expect(aborted).toBe(true);

        await stopHandle(handle);
    }, 20000);
});
