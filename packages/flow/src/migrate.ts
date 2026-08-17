import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { connect, type DbConfig } from './db';

const own = join(dirname(fileURLToPath(import.meta.url)), '..', 'migrations');

export const migrate = async (
    config: DbConfig,
    from: string = own,
): Promise<string[]> => {
    const db = connect(config);
    try {
        await db.query('create schema if not exists flow');
        await db.query(`
            create table if not exists flow.migrations (
                id         text primary key,
                applied_at timestamptz not null default now()
            )`);

        const { rows } = await db.query<{ id: string }>(
            'select id from flow.migrations',
        );
        const applied = new Set(rows.map((row) => row.id));

        const files = readdirSync(from)
            .filter((name) => name.endsWith('.sql'))
            .sort();

        const ran: string[] = [];
        for (const file of files) {
            if (applied.has(file)) continue;
            await db.query(readFileSync(join(from, file), 'utf8'));
            await db.query(
                'insert into flow.migrations (id) values ($1) on conflict (id) do nothing',
                [file],
            );
            ran.push(file);
        }
        return ran;
    } finally {
        await db.end();
    }
};
