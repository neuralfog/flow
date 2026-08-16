process.env.DB_HOST ??= 'localhost';
process.env.DB_PORT ??= '5432';
process.env.DB_USER ??= 'flow';
process.env.DB_PASSWORD ??= 'flow';
process.env.DB_NAME ??= 'flow';

await import('./dist/cli.js');
