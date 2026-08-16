import { beforeEach, describe, expect, it } from 'bun:test';
import { Flow } from '../src/flow';
import { defineJob } from '../src/job';
import { reset, spawnWorker, stateOf, stopHandle } from './harness';

beforeEach(reset);

describe('stop race', () => {
    it('never leaves a claimed job stuck in running when stopped mid-claim', async () => {
        const Job = defineJob('race-job');
        class Handler {
            static job = Job;
            async run(): Promise<void> {
                await Bun.sleep(5);
            }
        }

        for (let i = 0; i < 12; i++) {
            const id = await Flow.add(Job, {});
            const handle = spawnWorker(`race-worker-${i}`, [Handler]);
            await Bun.sleep(i * 6);
            await stopHandle(handle);

            const state = await stateOf(id);
            expect(state === 'scheduled' || state === 'completed').toBe(true);

            await reset();
        }
    }, 30000);
});
