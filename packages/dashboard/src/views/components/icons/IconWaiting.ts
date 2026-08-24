import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';
import css from '#src/views/components/icons/IconWaiting.scss?inline';

// #component
export class IconWaiting extends Component {
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
            <g class="hourglass">
                <path
                    class="frame"
                    d="M4.5 2.6h7M4.5 13.4h7"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1"
                    stroke-linecap="round"
                />
                <path
                    class="glass"
                    d="M5 3H11C11 5.4 9 6.8 8 8C9 9.2 11 10.6 11 13H5C5 10.6 7 9.2 8 8C7 6.8 5 5.4 5 3Z"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                />
                <path
                    class="sand-top"
                    d="M5.6 3.5Q8 3.5 10.4 3.5Q9 6.4 8 7.3Q7 6.4 5.6 3.5Z"
                    fill="currentColor"
                />
                <path
                    class="sand-bottom"
                    d="M5.6 12.5Q8 12.5 10.4 12.5Q9 9.6 8 8.7Q7 9.6 5.6 12.5Z"
                    fill="currentColor"
                />
            </g>
        </svg>
    `;
}
