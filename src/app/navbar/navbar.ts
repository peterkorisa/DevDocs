import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DocumentationService } from '../services/documentation.service';
import { ThemeService, Theme } from '../services/theme.service';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  searchQuery: string = '';
  currentTheme: Theme = 'light';
  private searchSubject = new Subject<string>();

  constructor(
    private docService: DocumentationService,
    private themeService: ThemeService
  ) {
    // Initialize theme
    this.currentTheme = this.themeService.getCurrentTheme();
    
    // Subscribe to theme changes
    this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });

    // Debounce search input - wait 300ms after user stops typing
    this.searchSubject.pipe(
      debounceTime(300)
    ).subscribe(query => {
      this.docService.setSearchQuery(query);
    });
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchQuery);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}

