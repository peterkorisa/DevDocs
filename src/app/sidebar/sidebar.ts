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
  favoriteArticleIds = new Set<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private docService: DocumentationService,
    private router: Router
  ) {
    this.categories$ = this.docService.getDocumentation();
  }

  ngOnInit(): void {
    this.docService.loadDocumentation()
      .pipe(takeUntil(this.destroy$))
      .subscribe();

    combineLatest([
      this.docService.getDocumentation(),
      this.docService.getSearchQuery()
    ])
    .pipe(takeUntil(this.destroy$))
    .subscribe(([categories, searchQuery]: [DocCategory[], string]) => {
      this.filteredCategories = this.docService.filterDocumentation(searchQuery);
    });

    this.docService.getSelectedArticle()
      .pipe(takeUntil(this.destroy$))
      .subscribe((article) => {
        if (article) {
          this.selectedArticleId = article.id;
        }
      });

    this.docService.getFavoriteArticleIds()
      .pipe(takeUntil(this.destroy$))
      .subscribe((favoriteIds) => {
        this.favoriteArticleIds = favoriteIds;
      });
  }

  selectArticle(article: DocArticle): void {
    this.docService.selectArticle(article);
    this.router.navigate(['/article', article.id]);
  }

  toggleFavorite(articleId: string, event: MouseEvent): void {
    event.stopPropagation();
    this.docService.toggleFavorite(articleId);
  }

  isFavorite(articleId: string): boolean {
    return this.favoriteArticleIds.has(articleId);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
