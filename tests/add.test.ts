import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { Flow } from '../src/flow';
import { defineJob } from '../src/job';
import { reset, startWorker, stateOf, stopWorker, waitState } from './harness';

beforeEach(reset);
afterEach(stopWorker);

describe('add', () => {
    it('runs an added job to completion', async () => {
        let ran = false;
        const Greet = defineJob('greet');
        class GreetHandler {
            static job = Greet;
            async run(): Promise<void> {
                ran = true;
            }
        }

        startWorker([GreetHandler]);

        const id = await Flow.add(Greet, {});
        const done = await waitState(id, 'completed');

        expect(done).toBe(true);
        expect(ran).toBe(true);
        expect(await stateOf(id)).toBe('completed');
    });

    it('round-trips nested/unicode/null args to the handler', async () => {
        const payload = {
            nested: { list: [1, 2, 3], text: 'héllo 🍕', empty: null },
            flag: true,
            count: 0,
        };
        let received: unknown = null;
        const Rich = defineJob<typeof payload>('rich-args');
        class RichHandler {
            static job = Rich;
            async run(args: typeof payload): Promise<void> {
                received = args;
            }
        }

        startWorker([RichHandler]);

        const id = await Flow.add(Rich, payload);
        expect(await waitState(id, 'completed')).toBe(true);
        expect(received).toEqual(payload);
    });

    it('claims ready jobs oldest execute_at first', async () => {
        const order: number[] = [];
        const Seq = defineJob<{ n: number }>('ordered-job');
        class SeqHandler {
            static job = Seq;
            async run(args: { n: number }): Promise<void> {
                order.push(args.n);
                await Bun.sleep(20);
            }
        }

        const now = Date.now();
        const c = await Flow.add(Seq, { n: 3 }, { at: new Date(now - 1000) });
        const a = await Flow.add(Seq, { n: 1 }, { at: new Date(now - 3000) });
        const b = await Flow.add(Seq, { n: 2 }, { at: new Date(now - 2000) });

        startWorker([SeqHandler], 'order-worker');

        expect(await waitState(c, 'completed')).toBe(true);
        expect(await waitState(a, 'completed')).toBe(true);
        expect(await waitState(b, 'completed')).toBe(true);
        expect(order).toEqual([1, 2, 3]);
    });
});
