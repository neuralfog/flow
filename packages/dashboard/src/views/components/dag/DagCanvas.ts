import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';
import {
    canvas,
    clampZoom,
    ZOOM_STEP,
} from '#src/views/components/dag/canvas';
import css from '#src/views/components/dag/DagCanvas.scss?inline';

// #component
export class DagCanvas extends Component {
    // #styles
    styles = css;

    // #state
    state = { panning: false };

    private startX = 0;
    private startY = 0;
    private startPanX = 0;
    private startPanY = 0;

    private get transformStyle(): string {
        return `--canvas-pan-x:${canvas.position.x}px;--canvas-pan-y:${canvas.position.y}px;--canvas-zoom:${canvas.zoom};`;
    }

    // #mount
    bindPan(): void {
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
    }

    // #dispose
    unbindPan(): void {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
    }

    private onMouseDown = (e: MouseEvent): void => {
        this.state.panning = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.startPanX = canvas.position.x;
        this.startPanY = canvas.position.y;
    };

    private onMouseMove = (e: MouseEvent): void => {
        if (!this.state.panning) return;
        e.preventDefault();
        canvas.position.x = this.startPanX + (e.clientX - this.startX);
        canvas.position.y = this.startPanY + (e.clientY - this.startY);
    };

    private onMouseUp = (): void => {
        this.state.panning = false;
    };

    private onWheel = (e: WheelEvent): void => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -ZOOM_STEP / 2 : ZOOM_STEP / 2;
        canvas.zoom = clampZoom(canvas.zoom + delta);
    };

    override template = (): Template => tpl`
        <div
            class=${{ scroll: true, 'is-panning': this.state.panning }}
            style=${this.transformStyle}
            @mousedown=${this.onMouseDown}
            @wheel=${this.onWheel}
        >
            <div class="content">
                <slot></slot>
            </div>
        </div>
        <div class="zoom">
            <slot name="zoom"></slot>
        </div>
        <div class="coordinates">
            <slot name="coordinates"></slot>
        </div>
    `;
}
