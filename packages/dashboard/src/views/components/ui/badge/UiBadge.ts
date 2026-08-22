import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';
import css from '#src/views/components/ui/badge/UiBadge.scss?inline';
import { Status } from '#src/views/types/Status';
import { statusText } from '#src/views/utils/statusText';

type Props = {
    status: Status;
    label?: string;
    pulse?: boolean;
};

// #component
export class UiBadge extends Component<Props> {
    // #styles
    styles = css;

    override template = (): Template => tpl`
        <span
            class="badge badge--${this.props.status}${this.props.pulse ? ' is-pulsing' : ''}"
        >
            <span class="dot"></span>
            <span
                class="label"
            >${this.props.label ?? statusText(this.props.status)}</span>
        </span>
    `;
}
