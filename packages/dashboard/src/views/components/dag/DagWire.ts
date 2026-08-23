import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';
import css from '#src/views/components/dag/DagWire.scss?inline';
import type { Segment } from '#src/views/components/dag/dag';

type Props = {
    wire: Segment;
    active?: boolean;
};

// #component
export class DagWire extends Component<Props> {
    // #styles
    styles = css;

    override template = (): Template => tpl`
        <div
            class=${{ wire: true, 'is-active': this.props.active }}
            style=${`left:${this.props.wire.x}px;top:${this.props.wire.y}px;width:${this.props.wire.width}px;height:${this.props.wire.height}px`}
        ></div>
    `;
}
