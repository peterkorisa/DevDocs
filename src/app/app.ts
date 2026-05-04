import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { Sidebar } from './sidebar/sidebar';
import { TOC } from './toc/toc';
import { ThemeService, Theme } from './services/theme.service';
import { DocumentationService } from './services/documentation.service';

@Component({
  selector: 'app-root',
  imports: [Navbar, Sidebar, HttpClientModule, TOC, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = 'DevDocs';
  currentTheme: Theme = 'light';

  constructor(
    private themeService: ThemeService,
    private docService: DocumentationService
  ) {}

  ngOnInit(): void {
    this.currentTheme = this.themeService.getCurrentTheme();
    this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  onSearchChange(query: string): void {
    this.docService.setSearchQuery(query);
  }

  onThemeToggle(): void {
    this.themeService.toggleTheme();
  }
}
