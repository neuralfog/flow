import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { connect, type DbConfig } from './db';

const own = join(dirname(fileURLToPath(import.meta.url)), '..', 'migrations');

export const migrate = async (
    config: DbConfig,
    from: string = own,
): Promise<string[]> => {
    const sql = connect(config);
    try {
        await sql`create schema if not exists flow`;
        await sql`
            create table if not exists flow.migrations (
                id         text primary key,
                applied_at timestamptz not null default now()
            )`;

        const rows = await sql<
            { id: string }[]
        >`select id from flow.migrations`;
        const applied = new Set(rows.map((row) => row.id));

        const files = readdirSync(from)
            .filter((name) => name.endsWith('.sql'))
            .sort();

        const ran: string[] = [];
        for (const file of files) {
            if (applied.has(file)) continue;
            await sql.unsafe(readFileSync(join(from, file), 'utf8'));
            await sql`
                insert into flow.migrations (id) values (${file})
                on conflict (id) do nothing`;
            ran.push(file);
        }
        return ran;
    } finally {
        await sql.end();
    }
};
