#!/usr/bin/env bun
import { commands } from './commands';
import type { DbConfig } from './db';
import { Flow } from './flow';

const required = (key: string): string => {
    const value = process.env[key];
    if (value === undefined) {
        console.error(`flow: ${key} is not set`);
        process.exit(1);
    }
    return value;
};

const config = (): DbConfig => ({
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? '5432'),
    user: required('DB_USER'),
    password: required('DB_PASSWORD'),
    database: required('DB_NAME'),
});

const usage = (): never => {
    console.error('usage: flow <command>');
    for (const command of commands) {
        console.error(`  ${command.name.padEnd(12)} ${command.summary}`);
    }
    process.exit(1);
};

const run = async (): Promise<void> => {
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
