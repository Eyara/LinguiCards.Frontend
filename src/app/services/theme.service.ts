import { Injectable, signal } from '@angular/core';

const THEME_KEY = 'theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly isDarkMode = signal(false);

  constructor() {
    const stored = localStorage.getItem(THEME_KEY);
    const prefersDark = stored === 'dark';
    this.isDarkMode.set(prefersDark);
    this.applyTheme(prefersDark);
  }

  toggle(): void {
    const dark = !this.isDarkMode();
    this.isDarkMode.set(dark);
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
    this.applyTheme(dark);
  }

  private applyTheme(dark: boolean): void {
    document.documentElement.classList.toggle('dark-theme', dark);
  }
}
