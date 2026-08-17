import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';
import css from './AppDocument.scss?inline';

import '#src/views/components/SiteHeader';

// #document
export class AppDocument extends Component {
    override template = (): Template => tpl`
        <html lang="en">
            <head>
                <meta charset="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <title>Flow Dashboard</title>
                <style>${css}</style>
            </head>
            <body>
                <site-header />
                <slot />
            </body>
        </html>
    `;
}