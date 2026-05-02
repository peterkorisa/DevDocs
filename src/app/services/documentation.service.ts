import { Injectable, signal, computed, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
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

  // ── Signal-based state ──
  private readonly _documentation = signal<DocCategory[]>([]);
  private readonly _selectedArticle = signal<DocArticle | null>(null);
  private readonly _searchQuery = signal<string>('');
  private readonly _favoriteArticleIds = signal<Set<string>>(new Set());

  // ── Public readonly signals ──
  readonly documentation = this._documentation.asReadonly();
  readonly selectedArticle = this._selectedArticle.asReadonly();
  readonly searchQuery = this._searchQuery.asReadonly();
  readonly favoriteArticleIds = this._favoriteArticleIds.asReadonly();

  // ── Computed signal: auto-filters documentation when search query changes ──
  readonly filteredCategories = computed(() => {
    const query = this._searchQuery().trim().toLowerCase();
    const docs = this._documentation();

    if (!query) {
      return docs;
    }

    return docs.map(category => ({
      ...category,
      children: category.children.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query)
      )
    })).filter(category => category.children.length > 0);
  });

  constructor(private http: HttpClient) {
    this.loadFavoritesFromStorage();
  }

  loadDocumentation(): Observable<Documentation> {
    return this.http.get<Documentation>('/documentation.json').pipe(
      tap((data) => {
        this._documentation.set(data.documentation);
      })
    );
  }

  selectArticle(article: DocArticle): void {
    this._selectedArticle.set(article);
  }

  getArticleById(id: string): DocArticle | null {
    const categories = this._documentation();
    for (const category of categories) {
      const article = category.children.find((child) => child.id === id);
      if (article) {
        return article;
      }
    }
    return null;
  }

  getArticleBySlug(slug: string): DocArticle | null {
    const categories = this._documentation();
    for (const category of categories) {
      const article = category.children.find((child) => child.slug === slug);
      if (article) {
        return article;
      }
    }
    return null;
  }

  setSearchQuery(query: string): void {
    this._searchQuery.set(query);
  }

  isFavorite(articleId: string): boolean {
    return this._favoriteArticleIds().has(articleId);
  }

  toggleFavorite(articleId: string): void {
    const updatedFavorites = new Set(this._favoriteArticleIds());

    if (updatedFavorites.has(articleId)) {
      updatedFavorites.delete(articleId);
    } else {
      updatedFavorites.add(articleId);
    }

    this._favoriteArticleIds.set(updatedFavorites);
    this.saveFavoritesToStorage(updatedFavorites);
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
        this._favoriteArticleIds.set(new Set(parsed.filter((id) => typeof id === 'string')));
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
