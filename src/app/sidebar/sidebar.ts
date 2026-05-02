import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentationService, DocCategory, DocArticle } from '../services/documentation.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit, OnDestroy {
  @Output() articleSelected = new EventEmitter<DocArticle>();

  private destroy$ = new Subject<void>();

  constructor(protected docService: DocumentationService) {}

  /** Read the computed signal directly */
  get filteredCategories(): DocCategory[] {
    return this.docService.filteredCategories();
  }

  /** Read the selected article signal */
  get selectedArticleId(): string | null {
    const article = this.docService.selectedArticle();
    return article ? article.id : null;
  }

  ngOnInit(): void {
    this.docService.loadDocumentation()
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  selectArticle(article: DocArticle): void {
    this.articleSelected.emit(article);
  }

  toggleFavorite(articleId: string, event: MouseEvent): void {
    event.stopPropagation();
    this.docService.toggleFavorite(articleId);
  }

  isFavorite(articleId: string): boolean {
    return this.docService.isFavorite(articleId);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
