import { InteractivityChecker } from '@angular/cdk/a11y';
import { inject, Injectable } from '@angular/core';
import { CoreStore } from '@core/stores/core.store';

@Injectable({
  providedIn: 'root',
})
export class FocusManagementService {
  private store = inject(CoreStore);
  private checker = inject(InteractivityChecker);

  public saveCurrentFocus(defaultFocusElement?: HTMLElement): void {
    const activeEl = document.activeElement as HTMLElement;

    if (activeEl && this.checker.isFocusable(activeEl)) {
      this.store.captureFocus(activeEl, defaultFocusElement);
    }
  }

  public returnFocus(): void {
    const el = this.store.lastFocus().lastFocusedElement;

    if (el && this.checker.isFocusable(el)) {
      el.focus();
    }

    this.clearFocus();
  }

  public returnDefaultFocus(): void {
    const el = this.store.lastFocus().defaultFocusedElement;

    if (el && this.checker.isFocusable(el)) {
      el.focus();
    }

    this.clearFocus();
  }

  public clearFocus(): void {
    this.store.clearFocus();
  }

  public hasFocus(): boolean {
    return this.store.lastFocus().lastFocusedElement !== null;
  }
}
