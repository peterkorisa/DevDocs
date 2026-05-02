import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DocumentationService, DocArticle, Section } from '../services/documentation.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  imports: [CommonModule],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main implements OnInit, OnDestroy {
  @Input() article: DocArticle | null = null;

  copiedId: string | null = null;
  private copyTimer: ReturnType<typeof setTimeout> | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private docService: DocumentationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Read route params and load article by ID
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        if (params['id']) {
          const article = this.docService.getArticleById(params['id']);
          if (article) {
            this.docService.selectArticle(article);
          }
        }
      });
  }

  /** If @Input is provided use it, otherwise fall back to service signal */
  get currentArticle(): DocArticle | null {
    return this.article ?? this.docService.selectedArticle();
  }

  copyCode(code: string, exampleId: string): void {
    navigator.clipboard.writeText(code).then(() => {
      this.copiedId = exampleId;
      if (this.copyTimer) clearTimeout(this.copyTimer);
      this.copyTimer = setTimeout(() => {
        this.copiedId = null;
      }, 2000);
    });
  }

  getSectionParagraphs(article: DocArticle, section: Section): string[] {
    if (section.body?.trim()) {
      return section.body
        .split(/\n\n+/)
        .map((paragraph) => paragraph.trim())
        .filter((paragraph) => paragraph.length > 0);
    }

    return [];
  }

  getSectionCodeExamples(article: DocArticle, section: Section): Array<{ id: string; title: string; language: string; code: string }> {
    if (section.codeExamples && section.codeExamples.length > 0) {
      return section.codeExamples;
    }

    return article.codeExamples ?? [];
  }

  toggleFavorite(articleId: string): void {
    this.docService.toggleFavorite(articleId);
  }

  isFavorite(articleId: string): boolean {
    return this.docService.isFavorite(articleId);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.copyTimer) clearTimeout(this.copyTimer);
  }
}
