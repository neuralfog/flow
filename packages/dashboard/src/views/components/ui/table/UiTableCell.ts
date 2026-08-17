import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';
import css from '#src/views/components/ui/table/UiTableCell.scss?inline';

// #component
export class UiTableCell extends Component {
    // #styles
    styles = css;

    override template = (): Template => tpl`<slot></slot>`;
}
