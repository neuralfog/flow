import { Flow } from '../flow';
export const migrate = {
    name: 'migrate',
    summary: 'apply pending migrations',
    async run() {
        const ran = await Flow.migrate();
        console.log(ran.length > 0
            ? `flow: applied ${ran.join(', ')}`
            : 'flow: up to date');
    },
};
