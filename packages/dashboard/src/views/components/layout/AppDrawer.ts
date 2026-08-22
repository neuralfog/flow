import { Component, tpl } from '@neuralfog/elemix';
import { repeat } from '@neuralfog/elemix/directives';
import type { Template } from '@neuralfog/elemix/types';
import css from '#src/views/components/layout/AppDrawer.scss?inline';

import '#src/views/components/NavItem';

type NavEntry = {
    label: string;
    href: string;
};

const NAV: NavEntry[] = [
    { label: 'Overview', href: '/' },
    { label: 'Jobs', href: '/jobs' },
    { label: 'Workers', href: '/workers' },
    { label: 'Schedules', href: '/schedules' },
    { label: 'Components', href: '/components' },
    { label: 'Canvas', href: '/canvas' },
];

// #component
export class AppDrawer extends Component {
    // #styles
    styles = css;

    override template = (): Template => tpl`
        <nav class="menu">
            ${repeat(
                NAV,
                (item) => tpl`
                    <nav-item :label=${item.label} :href=${item.href} />
                `,
                (item) => item.href,
            )}
        </nav>
    `;
}
