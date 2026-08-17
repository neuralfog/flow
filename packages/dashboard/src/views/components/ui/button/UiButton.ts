import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';
import css from '#src/views/components/ui/button/UiButton.scss?inline';

type Props = {
    label?: string;
    variant?: 'primary' | 'secondary';
    size?: 'default' | 'sm';
    disabled?: boolean;
    icon?: boolean;
};

// #component
export class UiButton extends Component<Props> {
    // #styles
    styles = css;

    ripple = (e: PointerEvent): void => {
        if (this.props.disabled) return;
        const btn = e.currentTarget as HTMLElement;
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const dx = Math.max(x, rect.width - x);
        const dy = Math.max(y, rect.height - y);
        const size = Math.hypot(dx, dy) * 2;
        const span = document.createElement('span');
        span.className = 'ripple';
        span.style.width = `${size}px`;
        span.style.height = `${size}px`;
        span.style.left = `${x - size / 2}px`;
        span.style.top = `${y - size / 2}px`;
        span.addEventListener('animationend', () => span.remove());
        btn.appendChild(span);
    };

    override template = (): Template => tpl`
        <button
            class="btn btn--${this.props.variant ?? 'primary'}${this.props.size === 'sm' ? ' btn--sm' : ''}${this.props.icon ? ' btn--icon' : ''}${this.props.disabled ? ' is-disabled' : ''}"
            @pointerdown=${this.ripple}
        >${this.props.label ?? ''}<slot></slot></button>
    `;
}
