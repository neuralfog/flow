import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';
import css from '#src/views/components/ThemeSwitch.scss?inline';

import '#src/views/components/icons/IconSun';
import '#src/views/components/icons/IconMoon';
import '#src/views/components/icons/IconMonitor';
import {
    applyTheme,
    storedPref,
    type ThemePref,
    watchSystemTheme,
} from '#src/views/utils/theme';

type State = {
    pref: ThemePref;
};

// #component #client
export class ThemeSwitch extends Component {
    // #styles
    styles = css;

    // #state
    state: State = {
        pref: storedPref(),
    };

    // #mount
    watchSystem(): void {
        watchSystemTheme(() => {
            if (this.state.pref === 'system') applyTheme('system');
        });
    }

    select = (pref: ThemePref): void => {
        applyTheme(pref);
        this.state.pref = pref;
    };

    override template = (): Template => tpl`
        <div class="switch" role="group" aria-label="Theme">
            <button
                class="opt ${this.state.pref === 'light' ? 'is-active' : ''}"
                @click=${() => this.select('light')}
                aria-label="Light theme"
            >
                <icon-sun />
            </button>
            <button
                class="opt ${this.state.pref === 'dark' ? 'is-active' : ''}"
                @click=${() => this.select('dark')}
                aria-label="Dark theme"
            >
                <icon-moon />
            </button>
            <button
                class="opt ${this.state.pref === 'system' ? 'is-active' : ''}"
                @click=${() => this.select('system')}
                aria-label="System theme"
            >
                <icon-monitor />
            </button>
        </div>
    `;
}
