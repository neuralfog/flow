const UNIT = {
    s: 1_000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000,
    w: 604_800_000,
};
export const ms = (duration) => {
    const match = /^(\d+)(s|m|h|d|w)$/.exec(duration);
    if (match === null) {
        throw new Error(`flow: invalid duration '${duration}'`);
    }
    return Number(match[1]) * UNIT[match[2]];
};
