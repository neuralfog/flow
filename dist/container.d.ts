export type Container = {
    scope(): Container;
    noHttp(): Container;
    get<T = unknown>(token: any): T;
    value(token: any, instance: unknown): Container;
    dispose(): void | Promise<void>;
};
