export const connectionUrl = (config) => {
    const user = encodeURIComponent(config.user);
    const password = encodeURIComponent(config.password);
    const query = config.ssl ? '?sslmode=require' : '';
    return `postgres://${user}:${password}@${config.host}:${config.port}/${config.database}${query}`;
};
export const connect = (config) => new Bun.SQL(connectionUrl(config));
