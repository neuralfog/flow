import { type DiContainer, ServiceProvider } from '@neuralfog/hydris/container';
import { DbClient } from '#src/services/DbClient';
import { Logger } from '#src/services/Logger';

export class Services extends ServiceProvider {
    register(container: DiContainer): void {
        container.bind(Logger);
        container.bind(DbClient);
    }
}
