import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';
import css from '#src/views/components/ui/table/UiTable.scss?inline';

// #component
export class UiTable extends Component {
    // #styles
    styles = css;

    override template = (): Template => tpl`
        <div class="table">
            <slot></slot>
        </div>
    `;
}
