import { beforeEach, describe, expect, it } from 'bun:test';
import { Flow } from '../src/flow';
import { defineJob } from '../src/job';
import { CONFIG, container, reset, waitState } from './harness';

beforeEach(reset);

describe('Flow.startWorker', () => {
    it('starts a fire-and-forget worker that runs jobs, and returns a stoppable handle', async () => {
        let ran = false;
        const Job = defineJob('flow-start-job');
        class Handler {
            static job = Job;
            async run(): Promise<void> {
                ran = true;
            }
        }

        const worker = Flow.startWorker({
            id: 'flow-start-worker',
            config: CONFIG,
            container,
            handlers: [Handler],
        });

        const id = await Flow.add(Job, {});
        const done = await waitState(id, 'completed');

        await worker.stop();

        expect(done).toBe(true);
        expect(ran).toBe(true);
    });
});
