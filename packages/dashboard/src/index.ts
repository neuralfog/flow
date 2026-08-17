import { App } from '@neuralfog/hydris';
import { env } from '@neuralfog/hydris/config';
import { server } from '#src/config/server';
import { Services } from '#src/services';
import { AppDocument } from '#src/views/documents/AppDocument';
import reset from '#src/views/scss/reset.scss?inline';
import pkg from '../package.json' with { type: 'json' };

import '#src/routes/web';

App.providers([Services]);

App.document(AppDocument);
App.resetStyles(reset);

if (env.get('NODE_ENV') === 'production') App.version(pkg.version);
else App.devMode({ liveReload: true, watch: 'src' });

App.serve(server);
