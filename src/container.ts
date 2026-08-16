export type DiContainer = {
    scope(): DiContainer;
    noHttp(): DiContainer;
    get<T = unknown>(token: any): T;
    value(token: any, instance: unknown): DiContainer;
    dispose(): void | Promise<void>;
};
