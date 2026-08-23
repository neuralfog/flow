import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';
import css from '#src/views/components/icons/IconRunning.scss?inline';

// #component
export class IconRunning extends Component {
    // #styles
    styles = css;

    override template = (): Template => tpl`
        <svg
            viewBox="0 0 16 16"
            width="16"
            height="16"
            style="display:block"
            aria-hidden="true"
        >
            <circle
                class="track"
                cx="8"
                cy="8"
                r="6"
                fill="none"
                stroke-width="2"
            />
            <circle
                class="arc"
                cx="8"
                cy="8"
                r="6"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-dasharray="9 29"
            />
        </svg>
    `;
}
