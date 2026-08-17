import type { DbConfig } from '@neuralfog/flow';
import { env } from '@neuralfog/hydris/config';

export const db: DbConfig = {
    host: env.get('DB_HOST') ?? 'localhost',
    port: env.number('DB_PORT', 5432),
    user: env.get('DB_USER') ?? 'flow',
    password: env.get('DB_PASSWORD') ?? 'flow',
    database: env.get('DB_NAME') ?? 'flow',
    ssl: env.get('DB_SSL') === 'true',
};
