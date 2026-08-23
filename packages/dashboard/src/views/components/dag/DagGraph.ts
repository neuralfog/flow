import { Component, tpl } from '@neuralfog/elemix';
import { repeat } from '@neuralfog/elemix/directives';
import type { Template } from '@neuralfog/elemix/types';
import css from '#src/views/components/dag/DagGraph.scss?inline';
import type { DagLayout } from '#src/views/components/dag/dag';
import { computeDagLayout } from '#src/views/components/dag/layout';
import { dag, hover } from '#src/views/components/dag/store';

import '#src/views/components/dag/DagWire';
import '#src/views/components/dag/DagArrow';
import '#src/views/components/dag/DagNode';

// #component
export class DagGraph extends Component {
    // #styles
    styles = css;

    private key: string | null | undefined;
    private highlighted = new Set<string>();

    get view(): DagLayout {
        return computeDagLayout(dag.jobs);
    }

    private active(): Set<string> {
        const hovered = hover.id;
        if (this.key !== hovered) {
            this.key = hovered;
            const set = new Set<string>();
            if (hovered) {
                const deps = new Map(
                    dag.jobs.map((job) => [job.id, job.dependsOn ?? []]),
                );
                const stack = [hovered];
                set.add(hovered);
                while (stack.length) {
                    const id = stack.pop() as string;
                    for (const parent of deps.get(id) ?? []) {
                        if (!set.has(parent)) {
                            set.add(parent);
                            stack.push(parent);
                        }
                    }
                }
            }
            this.highlighted = set;
        }
        return this.highlighted;
    }

    nodeActive = (id: string): boolean => this.active().has(id);

    edgeActive = (from: string, to: string): boolean => {
        const set = this.active();
        return set.has(from) && set.has(to);
    };

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
                        (wire) => tpl`
                            <dag-wire
                                :wire=${wire}
                                :active=${this.edgeActive(edge.from, edge.to)}
                            />
                        `,
                        (wire) => wire.id,
                    )}
                    <dag-arrow
                        :arrow=${{ id: edge.id, x: edge.headX, y: edge.headY }}
                        :active=${this.edgeActive(edge.from, edge.to)}
                    />
                `,
                (edge) => edge.id,
            )} ${repeat(
                this.view.nodes,
                (node) => tpl`
                    <dag-node
                        :node=${node}
                        :active=${this.nodeActive(node.id)}
                    />
                `,
                (node) => node.id,
            )}
        </div>
    `;
}
