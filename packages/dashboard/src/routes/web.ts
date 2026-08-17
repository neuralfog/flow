import { Route } from '@neuralfog/hydris/routing';
import { HomeHandler } from '#src/handlers/HomeHandler.js';

Route.get('/', [HomeHandler, 'index']);
