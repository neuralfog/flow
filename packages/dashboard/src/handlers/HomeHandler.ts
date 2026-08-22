import { Reply, Request } from '@neuralfog/hydris/http';
import { DbClient } from '#src/services/DbClient';
import { HomePage } from '#src/views/pages/HomePage';
import { Logger } from '#src/services/Logger.js';

export class HomeHandler {
    constructor(private logger:Logger) {}

    async index(db: DbClient, req: Request): Promise<Reply> {
        try {
            const ok = await db.ping();
            this.logger.info('ping', { status: ok, requestId: req.id });
        } catch (error) {
            this.logger.error('ping', error);
        }

        return Reply.view(HomePage);
    }
}
