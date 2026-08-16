import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { Flow } from '../src/flow';
import { defineJob } from '../src/job';
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

describe('delayed', () => {
    it('stays scheduled until the delay elapses, then completes', async () => {
        let ran = false;
        const Later = defineJob('delayed-greet');
        class LaterHandler {
            static job = Later;
            async run(): Promise<void> {
                ran = true;
            }
        }

        startWorker([LaterHandler], 'delayed-worker');

        const id = await Flow.add(Later, {}, { in: '2s' });

        expect(await stateOf(id)).toBe('scheduled');
        const row = await jobRow(id);
        const executeAt = new Date(row?.execute_at as string).getTime();
        expect(executeAt - Date.now()).toBeGreaterThan(1500);

        await Bun.sleep(800);
        expect(await stateOf(id)).toBe('scheduled');
        expect(ran).toBe(false);

        const done = await waitState(id, 'completed');
        expect(done).toBe(true);
        expect(ran).toBe(true);
    }, 20000);

    it('honours an absolute execute-at time', async () => {
        const At = defineJob('at-greet');
        class AtHandler {
            static job = At;
            async run(): Promise<void> {}
        }

        startWorker([AtHandler], 'at-worker');

        const when = new Date(Date.now() + 2000);
        const id = await Flow.add(At, {}, { at: when });

        const row = await jobRow(id);
        const executeAt = new Date(row?.execute_at as string).getTime();
        expect(Math.abs(executeAt - when.getTime())).toBeLessThan(50);
        expect(await stateOf(id)).toBe('scheduled');

        const done = await waitState(id, 'completed');
        expect(done).toBe(true);
    }, 20000);
});
