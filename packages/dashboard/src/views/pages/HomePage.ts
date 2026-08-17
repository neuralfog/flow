import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';

// #component
export class HomePage extends Component {
    override template = (): Template => tpl`
        hello there
    `;
}