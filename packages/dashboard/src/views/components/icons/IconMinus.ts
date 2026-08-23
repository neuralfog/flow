import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';

// #component
export class IconMinus extends Component {
    override template = (): Template => tpl`
        <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            style="display:block"
            aria-hidden="true"
        >
            <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    `;
}
