import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';
import css from '#src/views/documents/AppDocument.scss?inline';
import { userPrefs } from '#src/views/stores/userPrefs';

const speculationRules = JSON.stringify({
    prefetch: [
        {
            source: 'document',
            where: {
                and: [
                    { href_matches: '/*' },
                    { not: { href_matches: '/_elemix/*' } },
                ],
            },
            eagerness: 'moderate',
        },
    ],
});

// #document
export class AppDocument extends Component {
    override template = (): Template => tpl`
        <html
            lang="en"
            data-theme-pref="${userPrefs.theme}"
            data-theme="${userPrefs.theme === 'system' ? '' : userPrefs.theme}"
        >
            <head>
                <meta charset="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <title>Flow Dashboard</title>
                <link
                    rel="icon"
                    type="image/svg+xml"
                    href="/assets/favicon.svg"
                />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossorigin
                />
                <link
                    rel="preload"
                    as="font"
                    type="font/woff2"
                    href="https://fonts.gstatic.com/s/spacegrotesk/v22/V8mDoQDjQSkFtoMM3T6r8E7mPbF4Cw.woff2"
                    crossorigin
                />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap"
                />
                <script type="speculationrules">${speculationRules}</script>
                <style>${css}</style>
            </head>
            <body>
                <slot />
            </body>
        </html>
    `;
}
