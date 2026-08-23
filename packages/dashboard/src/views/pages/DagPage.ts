import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';
import css from '#src/views/pages/DagPage.scss?inline';

import '#src/views/layouts/DashboardLayout';
import '#src/views/components/dag/DagCanvas';
import '#src/views/components/dag/CanvasZoom';
import '#src/views/components/dag/CanvasCoordinates';
import '#src/views/components/dag/DagGraph';

// #component
export class DagPage extends Component {
    // #styles
    styles = css;

    override template = (): Template => tpl`
        <dashboard-layout>
            <dag-canvas>
                <dag-graph />
                <canvas-zoom slot="zoom" />
                <canvas-coordinates slot="coordinates" />
            </dag-canvas>
        </dashboard-layout>
    `;
}
