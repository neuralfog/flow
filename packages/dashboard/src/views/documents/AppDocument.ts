import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';
import { asset, fontFace } from '@neuralfog/hydris';
import css from '#src/views/documents/AppDocument.scss?inline';

const themeInit =
    "(function(){try{var p=localStorage.getItem('themePref');if(p){document.documentElement.dataset.themePref=p;if(p!=='system')document.documentElement.dataset.theme=p;}}catch(e){}})();";

const fonts = fontFace({
    family: 'Space Grotesk',
    src: 'src/views/fonts/SpaceGrotesk.woff2',
    weight: '400 700',
    display: 'swap',
});

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
                <link
                    rel="icon"
                    type="image/svg+xml"
                    href="${asset('/assets/favicon.svg')}"
                />
                <script>${themeInit}</script>
                <style>${fonts}${css}</style>
            </head>
            <body>
                <slot />
            </body>
        </html>
    `;
}
