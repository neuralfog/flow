import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';
import css from '#src/views/pages/DagPage.scss?inline';

import '#src/views/layouts/DashboardLayout';
import '#src/views/components/dag/DagGraph';

// #component
export class DagPage extends Component {
    // #styles
    styles = css;

    override template = (): Template => tpl`
        <dashboard-layout>
            <dag-graph />
        </dashboard-layout>
    `;
}
