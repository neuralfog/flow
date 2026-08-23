import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';
import css from '#src/views/components/StatusIndicator.scss?inline';
import { Status } from '#src/views/types/Status';
import { statusText } from '#src/views/utils/statusText';

import '#src/views/components/icons/IconScheduled';
import '#src/views/components/icons/IconRunning';
import '#src/views/components/icons/IconCompleted';
import '#src/views/components/icons/IconFailed';
import '#src/views/components/icons/IconTimedOut';

type Props = {
    status: Status;
    label?: string;
};

// #component
export class StatusIndicator extends Component<Props> {
    // #styles
    styles = css;

    override template = (): Template => tpl`
        <span class="status status--${this.props.status}">
            <span class="icon icon--scheduled">
                <icon-scheduled />
            </span>
            <span class="icon icon--running">
                <icon-running />
            </span>
            <span class="icon icon--completed">
                <icon-completed />
            </span>
            <span class="icon icon--failed">
                <icon-failed />
            </span>
            <span class="icon icon--timed_out">
                <icon-timed-out />
            </span>
            <span
                class="label"
            >${this.props.label ?? statusText(this.props.status)}</span>
        </span>
    `;
}
