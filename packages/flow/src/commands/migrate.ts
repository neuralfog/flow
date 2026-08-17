import { Flow } from '../flow';
import type { Command } from './command';

export const migrate: Command = {
    name: 'migrate',
    summary: 'apply pending migrations',
    async run(): Promise<void> {
        const ran = await Flow.migrate();
        console.log(
            ran.length > 0
                ? `flow: applied ${ran.join(', ')}`
                : 'flow: up to date',
        );
    },
};
