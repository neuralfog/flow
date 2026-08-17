import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';
import css from './SiteHeader.scss?inline';

// #component
export class SiteHeader extends Component {
    // #styles
    styles = css;

    override template = (): Template => tpl`
        <header class="header">
            <span class="dot"></span>
            <span>Flow Dashboard</span>
        </header>
    `;
}
