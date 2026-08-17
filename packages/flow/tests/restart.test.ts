import { beforeEach, describe, expect, it } from 'bun:test';
import { defineJob } from '../src/job';
import {
    query,
    reset,
    spawnWorker,
    stateOf,
    stopHandle,
    uuid,
    waitFor,
} from './harness';

beforeEach(reset);

describe('worker restart', () => {
    it('auto-reconciles an orphan when a worker re-registers with a new boot id', async () => {
        const oldBoot = uuid();

        await query(
            `insert into flow.workers (worker_id, boot_id) values ('restart-w', $1)`,
            [oldBoot],
        );
        const [orphan] = await query<{ id: string }>(
            `insert into flow.jobs (kind, args, state, worker_boot_id)
             values ('orphan', '{}', 'running', $1) returning id`,
            [oldBoot],
        );

        expect(await stateOf(orphan.id)).toBe('running');

        class NoopHandler {
            static job = defineJob('noop');
            async run(): Promise<void> {}
        }
        const handle = spawnWorker('restart-w', [NoopHandler]);

        const failed = await waitFor(
            async () => (await stateOf(orphan.id)) === 'failed',
        );
        await stopHandle(handle);

        expect(failed).toBe(true);
        const [row] = await query<{ last_error: string }>(
            'select last_error from flow.jobs where id = $1',
            [orphan.id],
        );
        expect(row.last_error).toBe('worker died mid-job');
    }, 20000);
});
