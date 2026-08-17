import { beforeEach, describe, expect, it } from 'bun:test';
import { Flow } from '../src/flow';
import { defineJob } from '../src/job';
import {
    query,
    reset,
    spawnWorker,
    stateOf,
    stopHandle,
    waitFor,
} from './harness';

beforeEach(reset);

const counts = async (): Promise<{
    running: number;
    scheduledRecurring: number;
    completed: number;
}> => {
    const [row] = await query<{
        running: number;
        scheduled_recurring: number;
        completed: number;
    }>(
        `select
            count(*) filter (where state = 'running')::int as running,
            count(*) filter (where state = 'scheduled' and repeat_every is not null)::int as scheduled_recurring,
            count(*) filter (where state = 'completed')::int as completed
         from flow.jobs where kind = 'recur-survive'`,
    );
    return {
        running: row.running,
        scheduledRecurring: row.scheduled_recurring,
        completed: row.completed,
    };
};

describe('recurring survives a dead worker without reconcile', () => {
    it('keeps firing via the seeded successor when an occurrence is stranded running', async () => {
        let ran = 0;
        const Recur = defineJob('recur-survive');
        class RecurHandler {
            static job = Recur;
            async run(): Promise<void> {
                ran += 1;
            }
        }

        await Flow.schedule(Recur, {}, { every: '1s' });

        // A worker in a bad state (no handler registered) claims the first
        // occurrence — the claim seeds the successor — then hard-crashes,
        // leaving that occurrence stranded in 'running'.
        const bad = spawnWorker('bad-recur', []);
        const stranded = await waitFor(async () => {
            const c = await counts();
            return c.running >= 1 && c.scheduledRecurring >= 1;
        });
        expect(stranded).toBe(true);

        const [strandedRow] = await query<{ id: string }>(
            "select id from flow.jobs where kind = 'recur-survive' and state = 'running' limit 1",
        );

        // No reconcile is ever called. A healthy worker comes online and must
        // pick up the already-seeded successor and keep the chain going.
        const good = spawnWorker('good-recur', [RecurHandler]);
        const advanced = await waitFor(
            async () => (await counts()).completed >= 1,
        );
        await stopHandle(good);
        await stopHandle(bad);

        expect(advanced).toBe(true);
        expect(ran).toBeGreaterThanOrEqual(1);

        const after = await counts();
        expect(after.scheduledRecurring).toBeGreaterThanOrEqual(1);
        expect(await stateOf(strandedRow.id)).toBe('running');
    }, 20000);
});
