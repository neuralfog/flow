import { Reply } from '@neuralfog/hydris/http';

export class ApiHandler {
    async index(): Promise<Reply> {
        return Reply.json({ hello: "there" });
    }
}
