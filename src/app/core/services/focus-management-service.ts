import { InteractivityChecker } from '@angular/cdk/a11y';
import { inject, Injectable } from '@angular/core';
import { CoreStore } from '@core/stores/core.store';

@Injectable({
  providedIn: 'root',
})
export class FocusManagementService {
  private store = inject(CoreStore);
  private checker = inject(InteractivityChecker);

  public saveCurrentFocus(): void {
    const activeEl = document.activeElement as HTMLElement;

    if (activeEl && this.checker.isFocusable(activeEl)) {
      this.store.captureFocus(activeEl);
    }
  }

  public returnFocus(): void {
    const el = this.store.lastFocusedElement();
    if (el && this.checker.isFocusable(el)) {
      el.focus();
    }
    this.store.clearFocus();
  }
}
