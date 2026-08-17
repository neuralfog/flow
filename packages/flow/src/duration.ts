const UNIT: Record<string, number> = {
    s: 1_000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000,
    w: 604_800_000,
};

export type Duration = `${number}${'s' | 'm' | 'h' | 'd' | 'w'}`;

export const ms = (duration: Duration): number => {
    const match = /^(\d+)(s|m|h|d|w)$/.exec(duration);
    if (match === null) {
        throw new Error(`flow: invalid duration '${duration}'`);
    }
    return Number(match[1]) * UNIT[match[2]];
};
