import { Route } from '@neuralfog/hydris/routing';
import { ApiHandler } from '#src/handlers/ApiHandler';

Route.group('/api', () => {
    Route.get('/', [ApiHandler, 'index'])
});
