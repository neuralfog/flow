type Level = 'info' | 'warn' | 'error' | 'critical';

const RESET = '\x1b[0m';
const DIM = '\x1b[2m';
const BOLD = '\x1b[1m';

const COLOR: Record<Level, string> = {
    info: '\x1b[36m',
    warn: '\x1b[33m',
    error: '\x1b[31m',
    critical: '\x1b[97m\x1b[41m',
};

const SINK: Record<Level, (...args: unknown[]) => void> = {
    info: console.log,
    warn: console.warn,
    error: console.error,
    critical: console.error,
};

const tty = Boolean(process.stdout.isTTY);

const paint = (code: string, text: string): string =>
    tty ? `${code}${text}${RESET}` : text;

const pad = (value: number, width = 2): string =>
    String(value).padStart(width, '0');

const stamp = (): string => {
    const d = new Date();
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3)}`;
};

export class Logger {
    private write(level: Level, message: string, args: unknown[]): void {
        const time = paint(DIM, stamp());
        const label = paint(`${BOLD}${COLOR[level]}`, level.toUpperCase());
        SINK[level](`${time} ${label} ${message}`, ...args);
    }

    info(message: string, ...args: unknown[]): void {
        this.write('info', message, args);
    }

    warn(message: string, ...args: unknown[]): void {
        this.write('warn', message, args);
    }

    error(message: string, ...args: unknown[]): void {
        this.write('error', message, args);
    }

    critical(message: string, ...args: unknown[]): void {
        this.write('critical', message, args);
    }
}
