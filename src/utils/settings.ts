import type { AppSettings } from '../types';

const SETTINGS_KEY = 'wordle-helper-settings';

/**
 * Default settings values
 */
const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  showSuggestions: true,
  hardMode: false,
  nytMode: true,  // Default to NYT mode
  wordLength: 5,  // Default word length for Open Mode
};

/**
 * Load settings from localStorage, falling back to defaults
 */
export function loadSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<AppSettings>;
      // Merge with defaults to handle missing fields
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
      };
    }
  } catch (e) {
    console.warn('Failed to load settings, using defaults:', e);
  }
  return { ...DEFAULT_SETTINGS };
}

/**
 * Save settings to localStorage
 */
export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save settings:', e);
  }
}

/**
 * Get default settings
 */
export function getDefaultSettings(): AppSettings {
  return { ...DEFAULT_SETTINGS };
}
