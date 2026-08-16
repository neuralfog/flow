import { beforeEach, describe, expect, it } from 'bun:test';
import { Flow } from '../src/flow';
import { defineJob } from '../src/job';
import { reset, spawnWorker, stateOf, stopHandle, waitFor } from './harness';

beforeEach(reset);

describe('graceful stop', () => {
    it('waits for the in-flight job to finish instead of abandoning it', async () => {
        let finished = false;
        const Slow = defineJob('slow-job');
        class SlowHandler {
            static job = Slow;
            async run(): Promise<void> {
                await Bun.sleep(500);
                finished = true;
            }
        }

        const handle = spawnWorker('graceful-worker', [SlowHandler]);
        const id = await Flow.add(Slow, {});

        const running = await waitFor(
            async () => (await stateOf(id)) === 'running',
        );
        expect(running).toBe(true);
        expect(finished).toBe(false);

        await stopHandle(handle);

        expect(finished).toBe(true);
        expect(await stateOf(id)).toBe('completed');
    }, 20000);
});
