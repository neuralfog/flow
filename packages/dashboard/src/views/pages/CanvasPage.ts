import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';
import css from '#src/views/pages/CanvasPage.scss?inline';

import '#src/views/layouts/DashboardLayout';

// #component
export class CanvasPage extends Component {
    // #styles
    styles = css;

    override template = (): Template => tpl`
        <dashboard-layout>
            <h1 class="title">Canvas</h1>
            <p class="subtitle">Hello world</p>
        </dashboard-layout>
    `;
}
