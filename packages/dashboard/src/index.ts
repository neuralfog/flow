import { App } from '@neuralfog/hydris';
import pkg from '../package.json' with { type: 'json' };
import { server } from '#src/config/server';
import { Services } from '#src/services';
import { AppDocument } from '#src/views/documents/AppDocument';

import '#src/routes/web';

App.providers([Services]);

App.document(AppDocument);

App.version(pkg.version);

App.serve(server);
