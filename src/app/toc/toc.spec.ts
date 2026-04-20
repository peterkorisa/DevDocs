import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TOC } from './toc';

describe('TOC', () => {
  let component: TOC;
  let fixture: ComponentFixture<TOC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TOC],
    }).compileComponents();

    fixture = TestBed.createComponent(TOC);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
