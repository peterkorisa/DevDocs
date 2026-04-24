import { Injectable } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { PLATFORM_ID, inject } from '@angular/core';
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
  body?: string;
  codeExamples?: CodeExample[];
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
  private readonly platformId = inject(PLATFORM_ID);
  private readonly favoritesStorageKey = 'devdocs.favoriteArticles';
  private documentation$ = new BehaviorSubject<DocCategory[]>([]);
  private selectedArticle$ = new BehaviorSubject<DocArticle | null>(null);
  private searchQuery$ = new BehaviorSubject<string>('');
  private favoriteArticleIds$ = new BehaviorSubject<Set<string>>(new Set());

  constructor(private http: HttpClient) {
    this.loadFavoritesFromStorage();
  }

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

  setSearchQuery(query: string): void {
    this.searchQuery$.next(query);
  }

  getSearchQuery(): Observable<string> {
    return this.searchQuery$.asObservable();
  }

  getFavoriteArticleIds(): Observable<Set<string>> {
    return this.favoriteArticleIds$.asObservable();
  }

  isFavorite(articleId: string): boolean {
    return this.favoriteArticleIds$.value.has(articleId);
  }

  toggleFavorite(articleId: string): void {
    const updatedFavorites = new Set(this.favoriteArticleIds$.value);

    if (updatedFavorites.has(articleId)) {
      updatedFavorites.delete(articleId);
    } else {
      updatedFavorites.add(articleId);
    }

    this.favoriteArticleIds$.next(updatedFavorites);
    this.saveFavoritesToStorage(updatedFavorites);
  }

  filterDocumentation(searchQuery: string): DocCategory[] {
    if (!searchQuery.trim()) {
      return this.documentation$.value;
    }

    const query = searchQuery.toLowerCase();
    return this.documentation$.value.map(category => ({
      ...category,
      children: category.children.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query)
      )
    })).filter(category => category.children.length > 0);
  }

  private loadFavoritesFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const rawValue = localStorage.getItem(this.favoritesStorageKey);
    if (!rawValue) {
      return;
    }

    try {
      const parsed = JSON.parse(rawValue);
      if (Array.isArray(parsed)) {
        this.favoriteArticleIds$.next(new Set(parsed.filter((id) => typeof id === 'string')));
      }
    } catch {
      localStorage.removeItem(this.favoritesStorageKey);
    }
  }

  private saveFavoritesToStorage(favoriteIds: Set<string>): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.setItem(this.favoritesStorageKey, JSON.stringify([...favoriteIds]));
  }
}
