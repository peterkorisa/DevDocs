import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { Inject, Optional } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'app-theme';
  private themeSubject: BehaviorSubject<Theme>;
  public theme$: Observable<Theme>;

  constructor(@Optional() @Inject(DOCUMENT) private document: Document) {
    let savedTheme: Theme = 'light';
    if (typeof localStorage !== 'undefined') {
      savedTheme = (localStorage.getItem(this.STORAGE_KEY) as Theme) || 'light';
    }
    
    this.themeSubject = new BehaviorSubject<Theme>(savedTheme);
    this.theme$ = this.themeSubject.asObservable();
    
    if (typeof localStorage !== 'undefined') {
      this.applyTheme(savedTheme);
    }
  }

  getCurrentTheme(): Theme {
    return this.themeSubject.value;
  }

  toggleTheme(): void {
    const newTheme: Theme = this.themeSubject.value === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  setTheme(theme: Theme): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, theme);
    }
    this.themeSubject.next(theme);
    if (typeof document !== 'undefined') {
      this.applyTheme(theme);
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
