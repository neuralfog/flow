import { Flow } from '../flow';
export const reconcile = {
    name: 'reconcile',
    summary: 'mark jobs stuck on dead workers as failed',
    async run() {
        const count = await Flow.reconcile();
        console.log(`flow: reconciled ${count} stuck job(s)`);
    },
};
