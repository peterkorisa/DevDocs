import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { App } from './app';
import { DocumentationService } from './services/documentation.service';

const documentationServiceMock: Partial<DocumentationService> = {
  loadDocumentation: () => of({ documentation: [] }),
  getDocumentation: () => of([]),
  getSearchQuery: () => of(''),
  getSelectedArticle: () => of(null),
  getFavoriteArticleIds: () => of(new Set<string>()),
  isFavorite: () => false,
  toggleFavorite: () => {},
  filterDocumentation: () => []
};

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: DocumentationService, useValue: documentationServiceMock }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render docs shell layout', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-navbar')).toBeTruthy();
    expect(compiled.querySelector('app-sidebar')).toBeTruthy();
    expect(compiled.querySelector('app-toc')).toBeTruthy();
  });
});
