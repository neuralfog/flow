export type Duration = `${number}${'s' | 'm' | 'h' | 'd' | 'w'}`;
export declare const ms: (duration: Duration) => number;
