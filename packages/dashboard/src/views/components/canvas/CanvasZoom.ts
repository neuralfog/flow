import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';
import css from '#src/views/components/canvas/CanvasZoom.scss?inline';
import '#src/views/components/ui/button/UiButton';
import {
    canvas,
    clampZoom,
    resetCanvas,
    ZOOM_MAX,
    ZOOM_MIN,
    ZOOM_STEP,
} from '#src/views/components/canvas/canvas';

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
            <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
            >
                <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
        </ui-button>
        <span class="label">${this.label}</span>
        <ui-button
            :icon=${true}
            :variant=${'outline'}
            :size=${'sm'}
            :disabled=${this.atMax}
            @click=${this.zoomIn}
        >
            <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
            >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
        </ui-button>
        <ui-button
            :icon=${true}
            :variant=${'outline'}
            :size=${'sm'}
            @click=${this.reset}
        >
            <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path
                    d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"
                />
            </svg>
        </ui-button>
    `;
}
