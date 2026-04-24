import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Sidebar } from './sidebar';
import { DocumentationService } from '../services/documentation.service';

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

describe('Sidebar', () => {
  let component: Sidebar;
  let fixture: ComponentFixture<Sidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sidebar],
      providers: [
        { provide: DocumentationService, useValue: documentationServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Sidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
