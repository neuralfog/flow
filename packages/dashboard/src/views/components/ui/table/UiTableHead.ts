import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';
import css from '#src/views/components/ui/table/UiTableHead.scss?inline';

// #component
export class UiTableHead extends Component {
    // #styles
    styles = css;

    override template = (): Template => tpl`<slot></slot>`;
}
