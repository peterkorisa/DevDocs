import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DocumentationService, DocCategory, DocArticle } from '../services/documentation.service';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit, OnDestroy {
  categories$!: ReturnType<typeof this.docService.getDocumentation>;
  filteredCategories: DocCategory[] = [];
  selectedArticleId: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private docService: DocumentationService,
    private router: Router
  ) {
    this.categories$ = this.docService.getDocumentation();
  }

  ngOnInit(): void {
    // Load documentation on init
    this.docService.loadDocumentation()
      .pipe(takeUntil(this.destroy$))
      .subscribe();

    // Subscribe to both documentation and search query changes
    combineLatest([
      this.docService.getDocumentation(),
      this.docService.getSearchQuery()
    ])
    .pipe(takeUntil(this.destroy$))
    .subscribe(([categories, searchQuery]: [DocCategory[], string]) => {
      // Filter categories based on search query
      this.filteredCategories = this.docService.filterDocumentation(searchQuery);
    });

    // Subscribe to selected article changes
    this.docService.getSelectedArticle()
      .pipe(takeUntil(this.destroy$))
      .subscribe((article) => {
        if (article) {
          this.selectedArticleId = article.id;
        }
      });
  }

  selectArticle(article: DocArticle): void {
    this.docService.selectArticle(article);
    this.router.navigate(['/article', article.id]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
