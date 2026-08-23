import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';
import css from '#src/views/components/dag/CanvasZoom.scss?inline';
import '#src/views/components/ui/button/UiButton';
import '#src/views/components/icons/IconMinus';
import '#src/views/components/icons/IconPlus';
import '#src/views/components/icons/IconRefresh';
import {
    canvas,
    clampZoom,
    resetCanvas,
    ZOOM_MAX,
    ZOOM_MIN,
    ZOOM_STEP,
} from '#src/views/components/dag/canvas';

// #component
export class CanvasZoom extends Component {
    // #styles
    styles = css;

    private get label(): string {
        return `${Math.round(canvas.zoom * 100)}%`;
    }

    private get atMin(): boolean {
        return canvas.zoom <= ZOOM_MIN;
    }

    private get atMax(): boolean {
        return canvas.zoom >= ZOOM_MAX;
    }

    private zoomOut = (): void => {
        canvas.zoom = clampZoom(canvas.zoom - ZOOM_STEP);
    };

    private zoomIn = (): void => {
        canvas.zoom = clampZoom(canvas.zoom + ZOOM_STEP);
    };

    private reset = (): void => {
        resetCanvas();
    };

    override template = (): Template => tpl`
        <ui-button
            :icon=${true}
            :variant=${'outline'}
            :size=${'sm'}
            :disabled=${this.atMin}
            @click=${this.zoomOut}
        >
            <icon-minus />
        </ui-button>
        <span class="label">${this.label}</span>
        <ui-button
            :icon=${true}
            :variant=${'outline'}
            :size=${'sm'}
            :disabled=${this.atMax}
            @click=${this.zoomIn}
        >
            <icon-plus />
        </ui-button>
        <ui-button
            :icon=${true}
            :variant=${'outline'}
            :size=${'sm'}
            @click=${this.reset}
        >
            <icon-refresh />
        </ui-button>
    `;
}
