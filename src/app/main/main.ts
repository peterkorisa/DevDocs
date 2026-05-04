import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentationService, DocArticle, Section } from '../services/documentation.service';

@Component({
  selector: 'app-main',
  imports: [CommonModule],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main implements OnDestroy {
  selectedArticle$!: ReturnType<typeof this.docService.getSelectedArticle>;
  copiedId: string | null = null;
  private copyTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private docService: DocumentationService) {
    this.selectedArticle$ = this.docService.getSelectedArticle();
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

    const overview = `${section.title} in ${article.title} explains the practical foundation of this topic and how it connects to day-to-day Angular development. ${article.content}`;
    const practice = `In practice, teams usually combine this concept with typed APIs, predictable state updates, and clear component boundaries. Build small examples first, then scale the pattern to larger features while keeping naming, folder structure, and responsibilities consistent.`;
    const quality = `For production-ready implementation, focus on readability, accessibility, and maintainability. Add tests around critical behavior, document assumptions, and revisit this section as your app grows so the same pattern remains easy to browse and understand over time.`;

    return [overview, practice, quality];
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
    if (this.copyTimer) clearTimeout(this.copyTimer);
  }
}
