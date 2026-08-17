import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';
import css from '#src/views/layouts/DashboardLayout.scss?inline';

import '#src/views/components/layout/AppHeader';
import '#src/views/components/layout/AppDrawer';

// #component
export class DashboardLayout extends Component {
    // #styles
    styles = css;

    override template = (): Template => tpl`
        <div class="shell">
            <app-header />
            <app-drawer />
            <main class="main">
                <div class="content">
                    <slot></slot>
                </div>
            </main>
        </div>
    `;
}
