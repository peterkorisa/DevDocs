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
    // Small delay to ensure DOM is fully rendered
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      console.log('Looking for section:', sectionId, 'Found:', !!element);
      
      if (element) {
        // Scroll the main-content container
        const mainContent = document.querySelector('.main-content') as HTMLElement;
        if (mainContent) {
          const elementRect = element.getBoundingClientRect();
          const containerRect = mainContent.getBoundingClientRect();
          const scrollPosition = mainContent.scrollTop + (elementRect.top - containerRect.top) - 50;
          
          mainContent.scrollTo({ 
            top: scrollPosition, 
            behavior: 'smooth' 
          });
          
          console.log('Scrolled to:', sectionId);
        } else {
          console.warn('main-content container not found');
        }
      } else {
        console.warn('Element with id not found:', sectionId);
      }
    }, 100);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
