import type { ServeOptions } from '@neuralfog/hydris';
import { env } from '@neuralfog/hydris/config';

export const server: ServeOptions = {
    port: env.number('PORT', 3000),
    hostname: env.get('HOST', 'localhost'),
    development: env.get('NODE_ENV') !== 'production',
    reusePort: env.get('REUSE_PORT') !== 'false',
    idleTimeout: env.number('IDLE_TIMEOUT', 30),
    maxRequestBodySize: env.number('MAX_REQUEST_BODY_SIZE', 1024 * 1024 * 16),
};
