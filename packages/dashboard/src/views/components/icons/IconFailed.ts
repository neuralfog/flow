import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';

// #component
export class IconFailed extends Component {
    override template = (): Template => tpl`
        <svg
            viewBox="0 0 16 16"
            width="16"
            height="16"
            fill="currentColor"
            style="display:block"
            aria-hidden="true"
        >
            <path
                d="M2.343 13.657A8 8 0 1 1 13.658 2.343 8 8 0 0 1 2.343 13.657ZM6.03 4.97a.75.75 0 0 0-1.06 1.06L6.94 8 4.97 9.97a.75.75 0 1 0 1.06 1.06L8 9.06l1.97 1.97a.75.75 0 1 0 1.06-1.06L9.06 8l1.97-1.97a.75.75 0 0 0-1.06-1.06L8 6.94 6.03 4.97Z"
            />
        </svg>
    `;
}
