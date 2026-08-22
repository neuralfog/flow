import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';
import css from '#src/views/components/canvas/CanvasCoordinates.scss?inline';
import { canvas } from '#src/views/components/canvas/canvas';

// #component
export class CanvasCoordinates extends Component {
    // #styles
    styles = css;

    override template = (): Template => tpl`
        <span class="pair">
            <span class="label">x</span>
            <span class="value">${Math.round(canvas.position.x)}</span>
        </span>
        <span class="pair">
            <span class="label">y</span>
            <span class="value">${Math.round(canvas.position.y)}</span>
        </span>
    `;
}
