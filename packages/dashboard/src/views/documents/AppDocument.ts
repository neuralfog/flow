import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';
import css from '#src/views/documents/AppDocument.scss?inline';

const themeInit =
    "(function(){try{var p=localStorage.getItem('themePref');if(p){document.documentElement.dataset.themePref=p;if(p!=='system')document.documentElement.dataset.theme=p;}}catch(e){}})();";

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
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossorigin
                />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
                />
                <script>${themeInit}</script>
                <style>${css}</style>
            </head>
            <body>
                <slot />
            </body>
        </html>
    `;
}
