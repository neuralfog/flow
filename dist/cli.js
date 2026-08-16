#!/usr/bin/env bun
import { commands } from './commands';
import { Flow } from './flow';
const required = (key) => {
    const value = process.env[key];
    if (value === undefined) {
        console.error(`flow: ${key} is not set`);
        process.exit(1);
    }
    return value;
};
const config = () => ({
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? '5432'),
    user: required('DB_USER'),
    password: required('DB_PASSWORD'),
    database: required('DB_NAME'),
});
const usage = () => {
    console.error('usage: flow <command>');
    for (const command of commands) {
        console.error(`  ${command.name.padEnd(12)} ${command.summary}`);
    }
    process.exit(1);
};
const run = async () => {
    const command = commands.find((c) => c.name === process.argv[2]);
    if (command === undefined) {
        usage();
        return;
    }
    Flow.config(config());
    await command.run(process.argv.slice(3));
    process.exit(0);
};
void run();
