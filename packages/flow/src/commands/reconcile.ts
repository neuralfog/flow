import { Flow } from '../flow';
import type { Command } from './command';

export const reconcile: Command = {
    name: 'reconcile',
    summary: 'mark jobs stuck on dead workers as failed',
    async run(): Promise<void> {
        const count = await Flow.reconcile();
        console.log(`flow: reconciled ${count} stuck job(s)`);
    },
};
