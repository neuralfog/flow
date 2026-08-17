export type ThemePref = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'themePref';

const media = (): MediaQueryList => matchMedia('(prefers-color-scheme: dark)');

export const storedPref = (): ThemePref =>
    (document.documentElement.dataset.themePref as ThemePref) ?? 'system';

export const applyTheme = (pref: ThemePref): void => {
    const root = document.documentElement;
    root.dataset.themePref = pref;
    if (pref === 'system') delete root.dataset.theme;
    else root.dataset.theme = pref;
    localStorage.setItem(STORAGE_KEY, pref);
};

export const watchSystemTheme = (onChange: () => void): void => {
    media().addEventListener('change', onChange);
};
