import { Component, OnInit, signal } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { Sidebar } from './sidebar/sidebar';
import { TOC } from './toc/toc';
import { ThemeService } from './services/theme.service';
import { DocumentationService, DocArticle } from './services/documentation.service';


@Component({
  selector: 'app-root',
  imports: [Navbar, Sidebar, HttpClientModule, TOC, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = 'DevDocs';

  /** Signal for mobile sidebar visibility */
  sidebarOpen = signal(false);

  constructor(
    private themeService: ThemeService,
    private docService: DocumentationService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  /** Read selected article from the service signal */
  get selectedArticle(): DocArticle | null {
    return this.docService.selectedArticle();
  }

  /** Handle @Output from Sidebar */
  onArticleSelected(article: DocArticle): void {
    this.docService.selectArticle(article);
    this.router.navigate(['/article', article.id]);
    this.sidebarOpen.set(false);
  }

  toggleSidebar(): void {
    this.sidebarOpen.update(open => !open);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }
}
