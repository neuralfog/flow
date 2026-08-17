import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';
import css from '#src/views/components/ui/input/UiInput.scss?inline';

type Props = {
    placeholder?: string;
    size?: 'default' | 'sm';
};

// #component
export class UiInput extends Component<Props> {
    // #styles
    styles = css;

    override template = (): Template => tpl`
        <input
            class="input${this.props.size === 'sm' ? ' input--sm' : ''}"
            placeholder="${this.props.placeholder ?? ''}"
        />
    `;
}
