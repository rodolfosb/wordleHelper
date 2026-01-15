type Theme = 'light' | 'dark';
const THEME_KEY = 'wordle-helper-theme';

export function getStoredTheme(): Theme | null {
  return localStorage.getItem(THEME_KEY) as Theme | null;
}

export function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function getInitialTheme(): Theme {
  return getStoredTheme() || getSystemTheme();
}

export function setTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

export function toggleTheme(): Theme {
  const current = document.documentElement.getAttribute('data-theme') as Theme || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}

export function getCurrentTheme(): Theme {
  return document.documentElement.getAttribute('data-theme') as Theme || 'dark';
}
