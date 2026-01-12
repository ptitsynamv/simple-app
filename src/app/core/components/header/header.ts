import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, effect, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AppStore } from '../../stores/app.store';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  public readonly store = inject(AppStore);
  private readonly _announcer = inject(LiveAnnouncer);

  constructor() {
    effect((): void => {
      const user = this.store.userInfo();
      if (user) {
        this._announcer.announce(`Logged in as ${user.name}`, 'polite');
      } else {
        this._announcer.announce('Logged out', 'polite');
      }
    });
  }

  public handleLogin(): void {
    this.store.login();
  }

  public handleLogout(): void {
    this.store.logout();
    this._focusHome();
  }

  private _focusHome(): void {
    const brand = document.querySelector('.navbar-brand') as HTMLElement;
    brand?.focus();
  }
}
