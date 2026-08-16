import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { Flow } from '../src/flow';
import { defineJob } from '../src/job';
import { query, reset, startWorker, stopWorker, waitFor } from './harness';

beforeEach(reset);
afterEach(stopWorker);

describe('recurring + retryable', () => {
    it('detaches the retrying occurrence so the seeded successor survives the unique index', async () => {
        let runs = 0;
        const Recur = defineJob('recur-retry', {
            retryable: true,
            attempts: 3,
            backoff: 150,
        });
        class RecurHandler {
            static job = Recur;
            async run(): Promise<void> {
                runs += 1;
                throw new Error('boom');
            }
        }

        startWorker([RecurHandler], 'recur-retry-worker');

        await Flow.schedule(Recur, {}, { every: '10s' });

        const exhausted = await waitFor(async () => {
            const [row] = await query<{ c: number }>(
                "select count(*)::int as c from flow.jobs where kind = 'recur-retry' and state = 'failed'",
            );
            return row.c === 1;
        });
        expect(exhausted).toBe(true);
        expect(runs).toBe(3);

        const [counts] = await query<{
            recurring: number;
            failed: number;
            failed_recurring: number;
        }>(
            `select
                count(*) filter (where state = 'scheduled' and repeat_every is not null)::int as recurring,
                count(*) filter (where state = 'failed')::int as failed,
                count(*) filter (where state = 'failed' and repeat_every is not null)::int as failed_recurring
             from flow.jobs where kind = 'recur-retry'`,
        );
        expect(counts.recurring).toBe(1);
        expect(counts.failed).toBe(1);
        expect(counts.failed_recurring).toBe(0);
    }, 20000);
});
