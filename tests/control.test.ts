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
    waitState,
} from './harness';

beforeEach(reset);

const setDesired = (workerId: string, state: string): Promise<unknown[]> =>
    query(
        'update flow.workers set desired_state = $2::flow.worker_state where worker_id = $1',
        [workerId, state],
    );

const registered = (workerId: string): Promise<boolean> =>
    waitFor(async () => {
        const [row] = await query<{ c: number }>(
            'select count(*)::int as c from flow.workers where worker_id = $1',
            [workerId],
        );
        return row.c >= 1;
    });

describe('worker control', () => {
    it('does not claim while paused, resumes when set back to running', async () => {
        let ran = false;
        const Job = defineJob('paused-job');
        class Handler {
            static job = Job;
            async run(): Promise<void> {
                ran = true;
            }
        }

        const handle = spawnWorker('pause-worker', [Handler]);
        await registered('pause-worker');
        await setDesired('pause-worker', 'paused');

        const id = await Flow.add(Job, {});
        await Bun.sleep(600);
        expect(await stateOf(id)).toBe('scheduled');
        expect(ran).toBe(false);

        await setDesired('pause-worker', 'running');
        const done = await waitState(id, 'completed');
        await stopHandle(handle);

        expect(done).toBe(true);
        expect(ran).toBe(true);
    }, 20000);

    it('shuts itself down when set to draining', async () => {
        class Handler {
            static job = defineJob('drain-job');
            async run(): Promise<void> {}
        }

        const handle = spawnWorker('drain-worker', [Handler]);
        await registered('drain-worker');
        await setDesired('drain-worker', 'draining');

        const stopped = await Promise.race([
            handle.loop.then(() => true),
            Bun.sleep(3000).then(() => false),
        ]);
        expect(stopped).toBe(true);

        await stopHandle(handle);
    }, 20000);
});
