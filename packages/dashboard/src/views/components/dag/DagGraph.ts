import { Component, tpl } from '@neuralfog/elemix';
import { repeat } from '@neuralfog/elemix/directives';
import type { Template } from '@neuralfog/elemix/types';
import css from '#src/views/components/dag/DagGraph.scss?inline';
import type { DagLayout } from '#src/views/components/dag/dag';
import { computeDagLayout } from '#src/views/components/dag/layout';
import { dag } from '#src/views/components/dag/store';

import '#src/views/components/dag/DagWire';
import '#src/views/components/dag/DagArrow';
import '#src/views/components/dag/DagNode';

// #component
export class DagGraph extends Component {
    // #styles
    styles = css;

    get view(): DagLayout {
        return computeDagLayout(dag.jobs);
    }

    override template = (): Template => tpl`
        <div
            class="flow"
            style=${`width:${this.view.width}px;height:${this.view.height}px`}
        >
            ${repeat(
                this.view.edges,
                (edge) => tpl`
                    ${repeat(
                        edge.segments,
                        (wire) => tpl`<dag-wire :wire=${wire} />`,
                        (wire) => wire.id,
                    )}
                    <dag-arrow
                        :arrow=${{ id: edge.id, x: edge.headX, y: edge.headY }}
                    />
                `,
                (edge) => edge.id,
            )} ${repeat(
                this.view.nodes,
                (node) => tpl`<dag-node :node=${node} />`,
                (node) => node.id,
            )}
        </div>
    `;
}
