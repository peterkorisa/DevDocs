import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DocumentationService } from '../services/documentation.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  imports: [CommonModule],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main implements OnInit, OnDestroy {
  selectedArticle$!: ReturnType<typeof this.docService.getSelectedArticle>;
  copiedId: string | null = null;
  private destroy$ = new Subject<void>();
  private copyTimer: any;

  constructor(
    private docService: DocumentationService,
    private route: ActivatedRoute
  ) {
    this.selectedArticle$ = this.docService.getSelectedArticle();
  }

  ngOnInit(): void {
    // Component ready
  }

  copyCode(code: string, exampleId: string): void {
    navigator.clipboard.writeText(code).then(() => {
      this.copiedId = exampleId;
      
      // Reset button after 2 seconds
      if (this.copyTimer) clearTimeout(this.copyTimer);
      this.copyTimer = setTimeout(() => {
        this.copiedId = null;
      }, 2000);
    });
  }

  processContent(content: string, sections: any[]): string {
    let processed = content;
    
    if (!sections || sections.length === 0) {
      return processed;
    }

    sections.forEach(section => {
      if (!section.id || !section.title || !section.level) {
        return;
      }
      
      const headingPrefix = '#'.repeat(section.level) + ' ';
      const headingText = headingPrefix + section.title;
      
      // Use regex to replace ALL occurrences with the exact heading pattern
      const regex = new RegExp('^' + headingText + '$', 'gm');
      const replacement = `<h${section.level} id="${section.id}">${section.title}</h${section.level}>`;
      
      processed = processed.replace(regex, replacement);
    });
    
    return processed;
  }

  ngOnDestroy(): void {
    if (this.copyTimer) clearTimeout(this.copyTimer);
    this.destroy$.next();
    this.destroy$.complete();
  }
}
