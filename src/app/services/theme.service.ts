import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'app-theme';

  // Signal-based theme state
  readonly theme = signal<Theme>(this.loadSavedTheme());

  constructor() {
    // effect() automatically reacts when the theme signal changes
    effect(() => {
      const currentTheme = this.theme();
      this.applyTheme(currentTheme);
      this.saveTheme(currentTheme);
    });
  }

  getCurrentTheme(): Theme {
    return this.theme();
  }

  toggleTheme(): void {
    this.theme.update(current => current === 'light' ? 'dark' : 'light');
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
  }

  private loadSavedTheme(): Theme {
    if (typeof localStorage !== 'undefined') {
      return (localStorage.getItem(this.STORAGE_KEY) as Theme) || 'light';
    }
    return 'light';
  }

  private saveTheme(theme: Theme): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, theme);
    }
  }

  private applyTheme(theme: Theme): void {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.setAttribute('data-theme', theme);
      root.classList.toggle('dark-mode', theme === 'dark');
    }
  }
}
