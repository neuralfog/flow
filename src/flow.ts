import type { DbConfig } from './db';
import { type Duration, ms } from './duration';
import { FlowWorker, type FlowWorkerOptions } from './flow-worker';
import { Inspector } from './inspector';
import type { JobContract } from './job';
import { migrate } from './migrate';
import { Queue } from './queue';

export type AddOptions = {
    in?: Duration;
    at?: Date;
};

export type ScheduleOptions = {
    every: Duration;
    at?: string;
};

const nextUtc = (hhmm: string): Date => {
    const [h, m] = hhmm.split(':').map(Number);
    const now = new Date();
    const d = new Date(
        Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            h,
            m,
        ),
    );
    if (d.getTime() <= now.getTime()) d.setUTCDate(d.getUTCDate() + 1);
    return d;
};

class FlowRuntime {
    private dbConfig: DbConfig | null = null;
    private queue: Queue | null = null;

    config(config: DbConfig): void {
        this.dbConfig = config;
    }

    startWorker(options: FlowWorkerOptions): FlowWorker {
        const worker = new FlowWorker(options);
        void worker.start();
        return worker;
    }

    add<A>(
        contract: JobContract<A>,
        args: A,
        options: AddOptions = {},
    ): Promise<string> {
        const at =
            options.in !== undefined
                ? new Date(Date.now() + ms(options.in))
                : options.at;
        return this.producer().enqueue(contract, args, { at });
    }

    schedule<A>(
        contract: JobContract<A>,
        args: A,
        options: ScheduleOptions,
    ): Promise<void> {
        const seconds = ms(options.every) / 1000;
        const at = options.at ? nextUtc(options.at) : new Date();
        return this.producer().schedule(contract, args, seconds, at);
    }

    reconcile(): Promise<number> {
        return this.producer().reconcile();
    }

    migrate(): Promise<string[]> {
        return migrate(this.require());
    }

    inspector(): Inspector {
        return new Inspector(this.require());
    }

    private producer(): Queue {
        if (this.queue === null) this.queue = new Queue(this.require());
        return this.queue;
    }

    private require(): DbConfig {
        if (this.dbConfig === null) {
            throw new Error('flow: call Flow.config(...) before using Flow');
        }
        return this.dbConfig;
    }
}

export const Flow = new FlowRuntime();
