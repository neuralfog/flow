import { Route } from '@neuralfog/hydris/routing';
import { HomeHandler } from '#src/handlers/HomeHandler';

Route.get('/', [HomeHandler, 'index']);
Route.get('/canvas', [HomeHandler, 'canvas']);
Route.get('/jobs', () => {
    throw Error();
});
