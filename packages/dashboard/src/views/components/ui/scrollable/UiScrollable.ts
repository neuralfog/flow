import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';
import css from '#src/views/components/ui/scrollable/UiScrollable.scss?inline';

type Props = {
    width?: string;
    height?: string;
};

// #component
export class UiScrollable extends Component<Props> {
    // #styles
    styles = css;

    override template = (): Template => tpl`
        <div
            class="scroll"
            style="width:${this.props.width ?? 'auto'};height:${this.props.height ?? 'auto'}"
        >
            <slot></slot>
        </div>
    `;
}
