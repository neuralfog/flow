import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';
import css from '#src/views/components/NavItem.scss?inline';

import '@neuralfog/hydris/navigation';

type Props = {
    label: string;
    href: string;
};

// #component
export class NavItem extends Component<Props> {
    // #styles
    styles = css;

    override template = (): Template => tpl`
        <nav-link route="${this.props.href}">
            <a
                class="menu-item"
                href="${this.props.href}"
            >${this.props.label}</a>
        </nav-link>
    `;
}
