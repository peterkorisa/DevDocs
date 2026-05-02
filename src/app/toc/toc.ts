import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentationService, DocArticle } from '../services/documentation.service';

@Component({
  selector: 'app-toc',
  imports: [CommonModule],
  templateUrl: './toc.html',
  styleUrl: './toc.css',
})
export class TOC {
  @Input() article: DocArticle | null = null;

  constructor(private docService: DocumentationService) {}

  /** If @Input is provided use it, otherwise fall back to service signal */
  get currentArticle(): DocArticle | null {
    return this.article ?? this.docService.selectedArticle();
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    const mainContent = document.querySelector('.main-content') as HTMLElement | null;

    if (!element || !mainContent) {
      return;
    }

    const topOffset = element.offsetTop - 85;
    mainContent.scrollTo({
      top: topOffset,
      behavior: 'smooth'
    });
  }
}
