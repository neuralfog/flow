import { Reply } from '@neuralfog/hydris/http';
import { DagPage } from '#src/views/pages/DagPage';
import { HomePage } from '#src/views/pages/HomePage';

export class HomeHandler {
    index(): Reply {
        return Reply.view(HomePage);
    }

    dagGraph(): Reply {
        return Reply.view(DagPage);
    }
}
