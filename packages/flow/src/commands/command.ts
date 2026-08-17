export type Command = {
    name: string;
    summary: string;
    run(args: string[]): Promise<void>;
};
