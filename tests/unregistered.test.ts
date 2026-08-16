import { beforeEach, describe, expect, it } from 'bun:test';
import { Flow } from '../src/flow';
import { defineJob } from '../src/job';
import { jobRow, reset, spawnWorker, stopHandle } from './harness';

beforeEach(reset);

describe('unregistered kind', () => {
    it('hard-crashes the worker instead of running or releasing the job', async () => {
        const Orphan = defineJob('unregistered-kind');
        class OtherHandler {
            static job = defineJob('registered-kind');
            async run(): Promise<void> {}
        }

        const id = await Flow.add(Orphan, {});
        const handle = spawnWorker('crash-worker', [OtherHandler]);

        const error = await handle.loop.then(
            () => null,
            (e: unknown) => e,
        );
        expect(error).toBeInstanceOf(Error);
        expect(String(error)).toContain('unregistered-kind');

        const row = await jobRow(id);
        expect(row?.state).toBe('running');
        expect(row?.completed_at).toBeNull();

        await stopHandle(handle);
    }, 20000);
});
