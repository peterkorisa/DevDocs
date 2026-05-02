import { Component, Output, EventEmitter } from '@angular/core';
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
  @Output() searchChanged = new EventEmitter<string>();
  @Output() themeToggled = new EventEmitter<void>();

  searchQuery: string = '';
  private searchSubject = new Subject<string>();

  constructor(
    private docService: DocumentationService,
    protected themeService: ThemeService
  ) {
    this.searchSubject.pipe(
      debounceTime(300)
    ).subscribe(query => {
      this.docService.setSearchQuery(query);
      this.searchChanged.emit(query);
    });
  }

  /** Read theme directly from signal */
  get currentTheme(): Theme {
    return this.themeService.theme();
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchQuery);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
    this.themeToggled.emit();
  }
}
