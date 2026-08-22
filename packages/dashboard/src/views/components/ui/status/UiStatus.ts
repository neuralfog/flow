import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';
import css from '#src/views/components/ui/status/UiStatus.scss?inline';
import { Status } from '#src/views/types/Status';
import { statusText } from '#src/views/utils/statusText';

type Props = {
    status: Status;
    label?: string;
};

// #component
export class UiStatus extends Component<Props> {
    // #styles
    styles = css;

    override template = (): Template => tpl`
        <span class="status status--${this.props.status}">
            <span class="icon icon--scheduled">
                <svg viewBox="0 0 16 16" width="16" height="16">
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
            </span>
            <span class="icon icon--running">
                <svg viewBox="0 0 16 16" width="16" height="16">
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
            </span>
            <span class="icon icon--completed">
                <svg
                    viewBox="0 0 16 16"
                    width="16"
                    height="16"
                    fill="currentColor"
                    fill-rule="evenodd"
                >
                    <path
                        d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16Zm3.78-9.72a.75.75 0 0 0-1.06-1.06L6.75 9.19 5.28 7.72a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0l4.5-4.5Z"
                    />
                </svg>
            </span>
            <span class="icon icon--failed">
                <svg
                    viewBox="0 0 16 16"
                    width="16"
                    height="16"
                    fill="currentColor"
                >
                    <path
                        d="M2.343 13.657A8 8 0 1 1 13.658 2.343 8 8 0 0 1 2.343 13.657ZM6.03 4.97a.75.75 0 0 0-1.06 1.06L6.94 8 4.97 9.97a.75.75 0 1 0 1.06 1.06L8 9.06l1.97 1.97a.75.75 0 1 0 1.06-1.06L9.06 8l1.97-1.97a.75.75 0 0 0-1.06-1.06L8 6.94 6.03 4.97Z"
                    />
                </svg>
            </span>
            <span class="icon icon--timed_out">
                <svg viewBox="0 0 16 16" width="16" height="16">
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
            </span>
            <span
                class="label"
            >${this.props.label ?? statusText(this.props.status)}</span>
        </span>
    `;
}
