import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CounterPage } from './counter-page';

describe('CounterPage', () => {
  let component: CounterPage;
  let fixture: ComponentFixture<CounterPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CounterPage],
    }).compileComponents();

    fixture = TestBed.createComponent(CounterPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have proper heading structure', () => {
    const heading = fixture.debugElement.query(By.css('h1'));
    expect(heading).toBeTruthy();
    expect(heading.nativeElement.textContent.trim()).toBe('SignalStore Counter');
    expect(heading.nativeElement.id).toBe('counter-title');
  });

  it('should have main role with aria-labelledby', () => {
    const main = fixture.debugElement.query(By.css('[role="main"]'));
    expect(main).toBeTruthy();
    expect(main.nativeElement.getAttribute('aria-labelledby')).toBe('counter-title');
  });

  it('should have aria-live regions for dynamic content', () => {
    const countDisplay = fixture.debugElement.query(By.css('.display-1'));
    const doubleCountBadge = fixture.debugElement.query(By.css('.badge'));

    expect(countDisplay.nativeElement.getAttribute('aria-live')).toBe('polite');
    expect(countDisplay.nativeElement.getAttribute('aria-atomic')).toBe('true');
    expect(doubleCountBadge.nativeElement.getAttribute('aria-live')).toBe('polite');
    expect(doubleCountBadge.nativeElement.getAttribute('aria-atomic')).toBe('true');
  });

  it('should have accessible buttons with proper labels', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons.length).toBe(3);

    const decrementBtn = buttons[0];
    const resetBtn = buttons[1];
    const incrementBtn = buttons[2];

    expect(decrementBtn.nativeElement.getAttribute('aria-label')).toContain('Decrement');
    expect(decrementBtn.nativeElement.getAttribute('type')).toBe('button');
    expect(decrementBtn.nativeElement.querySelector('i').getAttribute('aria-hidden')).toBe('true');

    expect(resetBtn.nativeElement.getAttribute('aria-label')).toBe('Reset counter to zero');
    expect(resetBtn.nativeElement.getAttribute('type')).toBe('button');

    expect(incrementBtn.nativeElement.getAttribute('aria-label')).toBe('Increment counter');
    expect(incrementBtn.nativeElement.getAttribute('type')).toBe('button');
    expect(incrementBtn.nativeElement.querySelector('i').getAttribute('aria-hidden')).toBe('true');
  });

  it('should handle disabled decrement button accessibility', () => {
    // Initially count is 2 from onInit, so decrement should be enabled
    fixture.detectChanges();
    const decrementBtn = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(decrementBtn.disabled).toBeFalse();
    expect(decrementBtn.getAttribute('aria-disabled')).toBe('false');

    // Reset to 0
    component.store.reset();
    fixture.detectChanges();
    expect(decrementBtn.disabled).toBeTrue();
    expect(decrementBtn.getAttribute('aria-disabled')).toBe('true');
    expect(decrementBtn.getAttribute('aria-label')).toContain('disabled');
  });
});
