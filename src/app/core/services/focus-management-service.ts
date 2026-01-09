import { inject, Injectable } from '@angular/core';
import { AppStore } from '../stores/app.store';
import { InteractivityChecker } from '@angular/cdk/a11y';

@Injectable({
  providedIn: 'root',
})
export class FocusManagementService {
  private store = inject(AppStore);
  private checker = inject(InteractivityChecker);

  public saveCurrentFocus() {
    const activeEl = document.activeElement as HTMLElement;
    if (activeEl && this.checker.isFocusable(activeEl)) {
      this.store.captureFocus(activeEl);
    }
  }

  public returnFocus() {
    const el = this.store.lastFocusedElement();
    if (el && this.checker.isFocusable(el)) {
      el.focus();
    }
    this.store.clearFocus();
  }
}
