import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadBook } from './read-book';

describe('ReadBook', () => {
  let component: ReadBook;
  let fixture: ComponentFixture<ReadBook>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadBook]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadBook);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
