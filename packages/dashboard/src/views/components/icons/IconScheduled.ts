import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';
import css from '#src/views/components/icons/IconScheduled.scss?inline';

// #component
export class IconScheduled extends Component {
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
                class="ring"
                cx="8"
                cy="8"
                r="6"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-dasharray="1.6 2.6"
            />
            <circle class="pip" cx="8" cy="8" r="1.75" />
        </svg>
    `;
}
