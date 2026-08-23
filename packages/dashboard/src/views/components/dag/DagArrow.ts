import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';
import css from '#src/views/components/dag/DagArrow.scss?inline';
import type { Arrow } from '#src/views/components/dag/dag';

type Props = {
    arrow: Arrow;
    active?: boolean;
};

// #component
export class DagArrow extends Component<Props> {
    // #styles
    styles = css;

    override template = (): Template => tpl`
        <div
            class=${{ arrow: true, 'is-active': this.props.active }}
            style=${`left:${this.props.arrow.x}px;top:${this.props.arrow.y}px`}
        ></div>
    `;
}
