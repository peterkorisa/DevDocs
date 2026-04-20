import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface CodeExample {
  id: string;
  title: string;
  language: string;
  code: string;
}

export interface Section {
  id: string;
  title: string;
  level: number;
}

export interface DocArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  sections: Section[];
  codeExamples: CodeExample[];
}

export interface DocCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  children: DocArticle[];
}

export interface Documentation {
  documentation: DocCategory[];
}

@Injectable({
  providedIn: 'root'
})
export class DocumentationService {
  private documentation$ = new BehaviorSubject<DocCategory[]>([]);
  private selectedArticle$ = new BehaviorSubject<DocArticle | null>(null);

  constructor(private http: HttpClient) {}

  loadDocumentation(): Observable<Documentation> {
    return this.http.get<Documentation>('/documentation.json').pipe(
      tap((data) => {
        this.documentation$.next(data.documentation);
      })
    );
  }

  getDocumentation(): Observable<DocCategory[]> {
    return this.documentation$.asObservable();
  }

  getSelectedArticle(): Observable<DocArticle | null> {
    return this.selectedArticle$.asObservable();
  }

  selectArticle(article: DocArticle): void {
    this.selectedArticle$.next(article);
  }

  getArticleBySlug(slug: string): DocArticle | null {
    const categories = this.documentation$.value;
    for (const category of categories) {
      const article = category.children.find((child) => child.slug === slug);
      if (article) {
        return article;
      }
    }
    return null;
  }
}
