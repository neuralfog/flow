import { STATUS_CODES } from 'node:http';
import {
    ErrorHandler,
    HttpException,
    statusOf,
} from '@neuralfog/hydris/errors';
import { Reply, type Request } from '@neuralfog/hydris/http';
import { type ErrorData, ErrorPage } from '#src/views/pages/ErrorPage';

const errorData = (status: number): ErrorData => {
    switch (status) {
        case 404:
            return {
                code: '404',
                label: 'Not Found',
                title: 'Lost in space',
                message: 'Nothing lives at this address.',
            };
        case 500:
            return {
                code: '500',
                label: 'Internal Server Error',
                title: 'Houston, we have a problem',
                message: 'Something blew up on our end.',
            };
        default:
            return {
                code: String(status),
                label: STATUS_CODES[status] ?? 'Error',
                title: 'Houston, we have a problem',
                message: 'Something went wrong on our end.',
            };
    }
};

export class WebErrorHandler extends ErrorHandler {
    render(error: unknown, req: Request): Reply {
        const status = statusOf(error);

        if ((req.headers.get('accept') ?? '').includes('application/json')) {
            const message =
                error instanceof HttpException
                    ? error.message
                    : (STATUS_CODES[status] ?? 'Error');
            return Reply.json({ error: message, status }).status(status);
        }

        return Reply.view(ErrorPage, errorData(status)).status(status);
    }
}
