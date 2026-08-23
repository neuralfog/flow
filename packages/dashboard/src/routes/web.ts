import { Reply } from '@neuralfog/hydris/http';
import { Route } from '@neuralfog/hydris/routing';
import { HomeHandler } from '#src/handlers/HomeHandler';

Route.get('/', [HomeHandler, 'index']);
Route.get('/dag', [HomeHandler, 'dagGraph']);
Route.get('/r', () => Reply.redirect('/dag'));
Route.get('/jobs', () => {
    throw Error();
});
