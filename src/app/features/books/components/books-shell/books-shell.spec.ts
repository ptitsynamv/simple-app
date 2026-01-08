import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksShell } from './books-shell';

describe('BooksShell', () => {
  let component: BooksShell;
  let fixture: ComponentFixture<BooksShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksShell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BooksShell);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
