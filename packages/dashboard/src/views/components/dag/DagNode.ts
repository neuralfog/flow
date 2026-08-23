import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';
import css from '#src/views/components/dag/DagNode.scss?inline';
import type { LayoutNode } from '#src/views/components/dag/dag';
import { hover } from '#src/views/components/dag/store';

type Props = {
    node: LayoutNode;
    active?: boolean;
};

// #component
export class DagNode extends Component<Props> {
    // #styles
    styles = css;

    enter = (event: MouseEvent): void => {
        hover.id = this.props.node.id;
        (event.currentTarget as HTMLElement).style.cursor = 'default';
    };

    leave = (event: MouseEvent): void => {
        hover.id = null;
        (event.currentTarget as HTMLElement).style.cursor = '';
    };

    stopDrag = (event: MouseEvent): void => {
        event.stopPropagation();
    };

    override template = (): Template => tpl`
        <div
            class="node"
            style=${`left:${this.props.node.x}px;top:${this.props.node.y}px;width:${this.props.node.width}px;height:${this.props.node.height}px`}
        >
            <div
                @mouseenter=${this.enter}
                @mouseleave=${this.leave}
                @mousedown=${this.stopDrag}
                class=${{ box: true, 'is-active': this.props.active }}
            >
                ${this.props.node.id}
            </div>
        </div>
    `;
}
