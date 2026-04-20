import { Component, OnInit, OnDestroy } from '@angular/core';
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
  categories$!: ReturnType<typeof this.docService.getDocumentation>;
  selectedArticleId: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(private docService: DocumentationService) {
    this.categories$ = this.docService.getDocumentation();
  }

  ngOnInit(): void {
    // Load documentation on init
    this.docService.loadDocumentation()
      .pipe(takeUntil(this.destroy$))
      .subscribe();

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
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
