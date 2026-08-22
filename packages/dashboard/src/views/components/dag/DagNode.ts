import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';
import css from '#src/views/components/dag/DagNode.scss?inline';
import type { LayoutNode } from '#src/views/components/dag/dag';

import '#src/views/components/ui/card/UiCard';

type Props = {
    node: LayoutNode;
};

// #component
export class DagNode extends Component<Props> {
    // #styles
    styles = css;

    override template = (): Template => tpl`
        <div
            class="node"
            style=${`left:${this.props.node.x}px;top:${this.props.node.y}px;width:${this.props.node.width}px;height:${this.props.node.height}px`}
        >
            <ui-card>${this.props.node.id}<br />hello there</ui-card>
        </div>
    `;
}
