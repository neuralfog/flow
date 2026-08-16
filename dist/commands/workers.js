import { Flow } from '../flow';
export const workers = {
    name: 'workers',
    summary: 'list workers',
    async run() {
        const rows = await Flow.inspector().workers();
        if (rows.length === 0) {
            console.log('flow: no registered workers');
            return;
        }
        console.table(rows);
    },
};
