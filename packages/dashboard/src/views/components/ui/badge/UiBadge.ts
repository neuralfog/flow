import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';
import css from '#src/views/components/ui/badge/UiBadge.scss?inline';

type Props = {
    label: string;
    tone?: 'ok' | 'warn' | 'err' | 'info' | 'neutral';
    pulse?: boolean;
};

// #component
export class UiBadge extends Component<Props> {
    // #styles
    styles = css;

    override template = (): Template => tpl`
        <span
            class="badge badge--${this.props.tone ?? 'neutral'}${this.props.pulse ? ' is-pulsing' : ''}"
        >
            <span class="dot"></span>
            <span class="label">${this.props.label}</span>
        </span>
    `;
}
