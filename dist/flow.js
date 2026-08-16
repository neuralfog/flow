import { ms } from './duration';
import { Inspector } from './Inspector';
import { migrate } from './migrate';
import { Queue } from './Queue';
import { register } from './registry';
import { Worker } from './Worker';
const nextUtc = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number);
    const now = new Date();
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), h, m));
    if (d.getTime() <= now.getTime())
        d.setUTCDate(d.getUTCDate() + 1);
    return d;
};
class FlowRuntime {
    constructor() {
        Object.defineProperty(this, "dbConfig", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "handlers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "queue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "worker", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
    }
    config(config) {
        this.dbConfig = config;
    }
    jobs(handlers) {
        this.handlers.push(...handlers);
    }
    add(contract, args, options = {}) {
        const at = options.in !== undefined
            ? new Date(Date.now() + ms(options.in))
            : options.at;
        return this.producer().enqueue(contract, args, { at });
    }
    schedule(contract, args, options) {
        const seconds = ms(options.every) / 1000;
        const at = options.at ? nextUtc(options.at) : new Date();
        return this.producer().schedule(contract, args, seconds, at);
    }
    reconcile() {
        return this.producer().reconcile();
    }
    migrate() {
        return migrate(this.require());
    }
    inspector() {
        return new Inspector(this.require());
    }
    async work(options) {
        this.worker = new Worker({
            id: options.id,
            config: this.require(),
            container: options.container,
            handlers: register(this.handlers),
            poll: options.poll,
        });
        await this.worker.start();
    }
    stop() {
        return this.worker === null ? Promise.resolve() : this.worker.stop();
    }
    producer() {
        if (this.queue === null)
            this.queue = new Queue(this.require());
        return this.queue;
    }
    require() {
        if (this.dbConfig === null) {
            throw new Error('flow: call Flow.config(...) before using Flow');
        }
        return this.dbConfig;
    }
}
export const Flow = new FlowRuntime();
