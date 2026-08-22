import { App } from '@neuralfog/hydris';
import { env } from '@neuralfog/hydris/config';
import { server } from '#src/config/server';
import { ApiErrorHandler } from '#src/errors/ApiErrorHandler';
import { WebErrorHandler } from '#src/errors/WebErrorHandler';
import { Services } from '#src/services';
import { AppDocument } from '#src/views/documents/AppDocument';
import reset from '#src/views/scss/reset.scss?inline';
import pkg from '../package.json' with { type: 'json' };

import '#src/routes/web';
import '#src/routes/api';

App.renderError('web', WebErrorHandler);
App.renderError('api', ApiErrorHandler);

App.providers([Services]);

App.document(AppDocument);
App.resetStyles(reset);
App.assets('assets', { dir: 'public' });

if (env.get('NODE_ENV') === 'production') App.version(pkg.version);
else App.devMode({ liveReload: true, watch: 'src' });

App.serve(server);
