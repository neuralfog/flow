import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { Flow } from '../src/flow';
import { defineJob } from '../src/job';
import {
    query,
    reset,
    spawnWorker,
    stopHandle,
    waitFor,
    waitState,
} from './harness';

beforeEach(reset);

describe('listen/notify', () => {
    let stop: (() => Promise<void>) | null = null;
    afterEach(async () => {
        if (stop) await stop();
        stop = null;
    });

    it('wakes a sleeping worker via NOTIFY', async () => {
        const Ping = defineJob('notify-ping');
        class PingHandler {
            static job = Ping;
            async run(): Promise<void> {}
        }

        const handle = spawnWorker('notify-worker', [PingHandler]);
        stop = () => stopHandle(handle);

        const started = Date.now();
        const id = await Flow.add(Ping, {});
        const done = await waitState(id, 'completed', 5000);
        const elapsed = Date.now() - started;

        expect(done).toBe(true);
        expect(elapsed).toBeLessThan(3000);
    }, 20000);

    it('resubscribes after its notifier connection is dropped', async () => {
        const Ping = defineJob('notify-recon-ping');
        class PingHandler {
            static job = Ping;
            async run(): Promise<void> {}
        }

        const handle = spawnWorker('notify-recon', [PingHandler]);
        stop = () => stopHandle(handle);

        const pids = async (): Promise<number[]> => {
            const rows = await query<{ pid: number }>(
                "select pid from pg_stat_activity where application_name like 'flow:worker:notify-recon:%'",
            );
            return rows.map((r) => r.pid);
        };

        await waitFor(async () => (await pids()).length >= 1);
        const before = await pids();

        await query(
            "select pg_terminate_backend(pid) from pg_stat_activity where application_name like 'flow:worker:notify-recon:%'",
        );

        const reconnected = await waitFor(async () => {
            const now = await pids();
            return now.length >= 1 && now.some((p) => !before.includes(p));
        });
        expect(reconnected).toBe(true);

        const started = Date.now();
        const id = await Flow.add(Ping, {});
        const done = await waitState(id, 'completed', 5000);
        const elapsed = Date.now() - started;

        expect(done).toBe(true);
        expect(elapsed).toBeLessThan(3000);
    }, 20000);

    it('drains work enqueued while the listen connection was down', async () => {
        const Job = defineJob('drain-recon');
        class Handler {
            static job = Job;
            async run(): Promise<void> {}
        }

        const handle = spawnWorker('drain-recon', [Handler]);
        stop = () => stopHandle(handle);

        await waitFor(async () => {
            const [row] = await query<{ c: number }>(
                "select count(*)::int as c from pg_stat_activity where application_name like 'flow:worker:drain-recon:%'",
            );
            return row.c >= 1;
        });

        await query(
            "select pg_terminate_backend(pid) from pg_stat_activity where application_name like 'flow:worker:drain-recon:%'",
        );
        const id = await Flow.add(Job, {});

        const started = Date.now();
        const done = await waitState(id, 'completed', 10000);
        const elapsed = Date.now() - started;

        expect(done).toBe(true);
        expect(elapsed).toBeLessThan(6000);
    }, 20000);
});
