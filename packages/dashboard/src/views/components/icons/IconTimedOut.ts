import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';

// #component
export class IconTimedOut extends Component {
    override template = (): Template => tpl`
        <svg
            viewBox="0 0 16 16"
            width="16"
            height="16"
            style="display:block"
            aria-hidden="true"
        >
            <circle cx="8" cy="8" r="8" fill="currentColor" />
            <path
                d="M8 4.25v4l2.5 1.5"
                fill="none"
                stroke="var(--surface)"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    `;
}
