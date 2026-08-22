import { Route } from '@neuralfog/hydris/routing';
import { HomeHandler } from '#src/handlers/HomeHandler';

Route.get('/', [HomeHandler, 'index']);
Route.get('/jobs', () => {
    throw Error();
});
