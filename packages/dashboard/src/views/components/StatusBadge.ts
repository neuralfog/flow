import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';
import css from '#src/views/components/StatusBadge.scss?inline';
import { Status } from '#src/views/types/Status';
import { statusText } from '#src/views/utils/statusText';

import '#src/views/components/ui/badge/UiBadge';

type Props = {
    status: Status;
    label?: string;
    pulse?: boolean;
};

type Variant = 'neutral' | 'info' | 'success' | 'warn' | 'error' | 'highlight';

const variant: Record<Status, Variant> = {
    [Status.Waiting]: 'highlight',
    [Status.Scheduled]: 'neutral',
    [Status.Running]: 'info',
    [Status.Completed]: 'success',
    [Status.Failed]: 'error',
    [Status.TimedOut]: 'warn',
};

// #component
export class StatusBadge extends Component<Props> {
    // #styles
    styles = css;

    override template = (): Template => tpl`
        <ui-badge
            :label=${this.props.label ?? statusText(this.props.status)}
            :variant=${variant[this.props.status]}
            :dot=${true}
            :pulse=${this.props.pulse}
        />
    `;
}
