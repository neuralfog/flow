import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';
import css from '#src/views/components/ThemeSwitch.scss?inline';

import '#src/views/components/icons/IconSun';
import '#src/views/components/icons/IconMoon';
import '#src/views/components/icons/IconMonitor';
import {
    applyTheme,
    type ThemePref,
    userPrefs,
    watchSystemTheme,
} from '#src/views/utils/theme';

// #component
export class ThemeSwitch extends Component {
    // #styles
    styles = css;

    // #mount
    watchSystem(): void {
        watchSystemTheme(() => {
            if (userPrefs.theme === 'system') applyTheme('system');
        });
    }

    select = (pref: ThemePref): void => {
        applyTheme(pref);
    };

    override template = (): Template => tpl`
        <div class="switch" role="group" aria-label="Theme">
            <button
                class="opt ${userPrefs.theme === 'light' ? 'is-active' : ''}"
                @click=${() => this.select('light')}
                aria-label="Light theme"
            >
                <icon-sun />
            </button>
            <button
                class="opt ${userPrefs.theme === 'dark' ? 'is-active' : ''}"
                @click=${() => this.select('dark')}
                aria-label="Dark theme"
            >
                <icon-moon />
            </button>
            <button
                class="opt ${userPrefs.theme === 'system' ? 'is-active' : ''}"
                @click=${() => this.select('system')}
                aria-label="System theme"
            >
                <icon-monitor />
            </button>
        </div>
    `;
}
