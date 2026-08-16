import { Flow } from '../flow';
import type { Command } from './command';

export const workers: Command = {
    name: 'workers',
    summary: 'list workers',
    async run(): Promise<void> {
        const rows = await Flow.inspector().workers();
        if (rows.length === 0) {
            console.log('flow: no registered workers');
            return;
        }
        console.table(rows);
    },
};
