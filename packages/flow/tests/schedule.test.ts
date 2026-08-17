import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { Flow } from '../src/flow';
import { defineJob } from '../src/job';
import { query, reset, startWorker, stopWorker, waitFor } from './harness';

beforeEach(reset);
afterEach(stopWorker);

describe('schedule', () => {
    it('runs the first occurrence and seeds a successor anchored to execute_at', async () => {
        let runs = 0;
        const Tick = defineJob('recur-tick');
        class TickHandler {
            static job = Tick;
            async run(): Promise<void> {
                runs += 1;
            }
        }

        startWorker([TickHandler], 'schedule-worker');

        await Flow.schedule(Tick, {}, { every: '10s' });

        const ready = await waitFor(async () => {
            const [row] = await query<{ completed: number; scheduled: number }>(
                `select
                    count(*) filter (where state = 'completed')::int as completed,
                    count(*) filter (where state = 'scheduled')::int as scheduled
                 from flow.jobs where kind = $1`,
                ['recur-tick'],
            );
            return row.completed >= 1 && row.scheduled >= 1;
        });
        expect(ready).toBe(true);
        expect(runs).toBe(1);

        const [anchor] = await query<{ anchored: boolean; recurring: boolean }>(
            `select
                (s.execute_at - c.execute_at) = interval '10 seconds' as anchored,
                s.repeat_every = interval '10 seconds' as recurring
             from flow.jobs c, flow.jobs s
             where c.kind = $1 and c.state = 'completed'
               and s.kind = $1 and s.state = 'scheduled'`,
            ['recur-tick'],
        );
        expect(anchor.anchored).toBe(true);
        expect(anchor.recurring).toBe(true);
    }, 20000);

    it('upserts a recurring job by kind instead of inserting a duplicate', async () => {
        const Tick = defineJob<{ v: number }>('upsert-tick');

        await Flow.schedule(Tick, { v: 1 }, { every: '10s' });
        await Flow.schedule(Tick, { v: 2 }, { every: '20s' });

        const rows = await query<{
            args: string;
            recurring: boolean;
        }>(
            `select args, repeat_every = interval '20 seconds' as recurring
             from flow.jobs
             where kind = 'upsert-tick' and state = 'scheduled' and repeat_every is not null`,
        );

        expect(rows.length).toBe(1);
        expect(rows[0].args).toBe('{"v":2}');
        expect(rows[0].recurring).toBe(true);
    });
});
