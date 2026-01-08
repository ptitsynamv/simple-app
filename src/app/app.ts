import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AppStore } from './core/stores/app.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('simple');
  readonly store = inject(AppStore);

  constructor() {
    this.store.setLoading(true);
    const success = await this.authService.authenticate(this.username, this.password);
    if (success) {
      this.authStore.loginSuccess(this.authService.getCurrentUser());
      // Navigate to dashboard
    } else {
      this.authStore.setLoading(false);
      // Show error
    }
  }
}
