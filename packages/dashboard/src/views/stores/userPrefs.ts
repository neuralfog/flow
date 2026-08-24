export type ThemePref = 'light' | 'dark' | 'system';

export type UserPrefsStore = {
    theme: ThemePref;
};

// #store user-prefs
export const userPrefs: UserPrefsStore = { theme: 'system' };
