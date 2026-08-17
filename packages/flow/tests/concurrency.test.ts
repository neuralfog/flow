import { beforeEach, describe, expect, it } from 'bun:test';
import { Flow } from '../src/flow';
import { defineJob, type JobContext } from '../src/job';
import { query, reset, spawnWorker, stopHandle, waitFor } from './harness';

beforeEach(reset);

describe('two workers', () => {
    it('splits the queue with no double-claim', async () => {
        const runs = new Map<string, number>();
        const Task = defineJob<{ n: number }>('parallel-task');
        class TaskHandler {
            static job = Task;
            async run(_args: { n: number }, ctx: JobContext): Promise<void> {
                runs.set(ctx.id, (runs.get(ctx.id) ?? 0) + 1);
                await Bun.sleep(30);
            }
        }

        const total = 20;
        for (let n = 0; n < total; n++) {
            await Flow.add(Task, { n });
        }

        const a = spawnWorker('cw-1', [TaskHandler]);
        const b = spawnWorker('cw-2', [TaskHandler]);

        const done = await waitFor(async () => {
            const [row] = await query<{ c: number }>(
                "select count(*)::int as c from flow.jobs where kind = 'parallel-task' and state = 'completed'",
            );
            return row.c === total;
        });

        await stopHandle(a);
        await stopHandle(b);

        expect(done).toBe(true);
        expect(runs.size).toBe(total);
        for (const count of runs.values()) {
            expect(count).toBe(1);
        }

        const workers = await query<{ jobs_done: string }>(
            "select jobs_done from flow.workers where worker_id in ('cw-1', 'cw-2')",
        );
        expect(workers.length).toBe(2);
        const summed = workers.reduce((sum, w) => sum + Number(w.jobs_done), 0);
        expect(summed).toBe(total);
        expect(workers.every((w) => Number(w.jobs_done) > 0)).toBe(true);
    }, 20000);
});
