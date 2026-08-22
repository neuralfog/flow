import {
    ErrorHandler,
    HttpException,
    statusOf,
} from '@neuralfog/hydris/errors';
import { Reply, type Request } from '@neuralfog/hydris/http';

export class ApiErrorHandler extends ErrorHandler {
    render(error: unknown, _req: Request): Reply {
        const status = statusOf(error);
        const message =
            error instanceof HttpException
                ? error.message
                : 'Internal Server Error';
        return Reply.json({ error: message, status }).status(status);
    }
}
