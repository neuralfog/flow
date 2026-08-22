import { Reply } from '@neuralfog/hydris/http';
import { DbClient } from '#src/services/DbClient';
import { HomePage } from '#src/views/pages/HomePage';

export class HomeHandler {
    async index(db: DbClient): Promise<Reply> {
        try {
            const ok = await db.ping();
            console.log('[db] ping ok:', ok);
        } catch (error) {
            console.error('[db] ping failed:', error);
        }

        return Reply.view(HomePage);
    }
}
