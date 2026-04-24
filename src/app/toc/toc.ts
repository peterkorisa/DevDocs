import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentationService } from '../services/documentation.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-toc',
  imports: [CommonModule],
  templateUrl: './toc.html',
  styleUrl: './toc.css',
})
export class TOC implements OnInit, OnDestroy {
  selectedArticle$!: ReturnType<typeof this.docService.getSelectedArticle>;
  private destroy$ = new Subject<void>();

  constructor(private docService: DocumentationService) {
    this.selectedArticle$ = this.docService.getSelectedArticle();
  }

  ngOnInit(): void {}

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    const mainContent = document.querySelector('.main-content') as HTMLElement | null;

    if (!element || !mainContent) {
      return;
    }

    const topOffset = element.offsetTop - 24;
    mainContent.scrollTo({
      top: topOffset,
      behavior: 'smooth'
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
