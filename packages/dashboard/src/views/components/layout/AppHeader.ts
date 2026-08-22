import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';
import css from '#src/views/components/layout/AppHeader.scss?inline';

import '#src/views/components/ThemeSwitch';
import '#src/views/components/icons/IconLogo';

// #component
export class AppHeader extends Component {
    // #styles
    styles = css;

    override template = (): Template => tpl`
        <a class="brand" href="/">
            <icon-logo :size=${24} />
            Flow
        </a>
        <div class="end">
            <theme-switch />
        </div>
    `;
}
