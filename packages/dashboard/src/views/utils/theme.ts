import '@neuralfog/hydris/store';

export type ThemePref = 'light' | 'dark' | 'system';

// #store user-prefs
export const userPrefs = { theme: 'system' as ThemePref };

const media = (): MediaQueryList => matchMedia('(prefers-color-scheme: dark)');

export const applyTheme = (pref: ThemePref): void => {
    const root = document.documentElement;
    root.style.setProperty('--motion', '0s');
    root.dataset.themePref = pref;
    if (pref === 'system') delete root.dataset.theme;
    else root.dataset.theme = pref;
    userPrefs.theme = pref;
    void root.offsetHeight;
    requestAnimationFrame(() => {
        root.style.removeProperty('--motion');
    });
};

export const watchSystemTheme = (onChange: () => void): void => {
    media().addEventListener('change', onChange);
};
