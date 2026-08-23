import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';
import css from '#src/views/components/ui/badge/UiBadge.scss?inline';

type Props = {
    label: string;
    variant?: 'neutral' | 'info' | 'success' | 'warn' | 'error';
    dot?: boolean;
    pulse?: boolean;
};

// #component
export class UiBadge extends Component<Props> {
    // #styles
    styles = css;

    override template = (): Template => tpl`
        <span
            class="badge badge--${this.props.variant ?? 'neutral'}${this.props.pulse ? ' is-pulsing' : ''}"
        >
            ${this.props.dot ? tpl`<span class="dot"></span>` : ''}
            <span class="label">${this.props.label}</span>
        </span>
    `;
}
