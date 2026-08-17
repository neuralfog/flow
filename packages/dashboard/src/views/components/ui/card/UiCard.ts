import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';
import css from '#src/views/components/ui/card/UiCard.scss?inline';

// #component
export class UiCard extends Component {
    // #styles
    styles = css;

    override template = (): Template => tpl`
        <div class="card">
            ${
                this.hasSlot('header')
                    ? tpl`
                        <div class="card-header">
                            <slot name="header"></slot>
                        </div>
                    `
                    : ''
            }
            <div class="card-body">
                <slot></slot>
            </div>
            ${
                this.hasSlot('footer')
                    ? tpl`
                        <div class="card-footer">
                            <slot name="footer"></slot>
                        </div>
                    `
                    : ''
            }
        </div>
    `;
}
