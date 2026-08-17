import { type DiContainer, ServiceProvider } from '@neuralfog/hydris/container';
import { DbClient } from '#src/services/DbClient';

export class Services extends ServiceProvider {
    register(container: DiContainer): void {
        container.bind(DbClient);
    }
}
