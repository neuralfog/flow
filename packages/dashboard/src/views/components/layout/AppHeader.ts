import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';
import css from '#src/views/components/layout/AppHeader.scss?inline';

import '#src/views/components/ThemeSwitch';

// #component
export class AppHeader extends Component {
    // #styles
    styles = css;

    override template = (): Template => tpl`
        <a class="brand" href="/"><span class="brand-mark"></span> Flow</a>
        <div class="end">
            <theme-switch />
        </div>
    `;
}
