import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: 'form[appFocusInvalid]',
  standalone: true,
})
export class FocusInvalid {
  private _el = inject(ElementRef);
  private _announcer = inject(LiveAnnouncer);

  @HostListener('submit', ['$event'])
  public onFormSubmit(event: Event): void {
    const form = this._el.nativeElement as HTMLFormElement;

    if (!form.checkValidity() || form.classList.contains('ng-invalid')) {
      event.preventDefault();

      const firstInvalidControl = form.querySelector(
        '.ng-invalid:not(form), [aria-invalid="true"]'
      ) as HTMLElement;

      if (firstInvalidControl) {
        firstInvalidControl.focus();
        firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      this._announcer.announce(
        'Form submission failed. Please check the highlighted fields.',
        'assertive'
      );
    }
  }
}
