import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, effect, ElementRef, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenubarDirective } from '@core/directives/menubar';
import { LanguageService } from '@core/services/language-service';
import { CoreStore } from '@core/stores/core.store';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MenubarDirective, TranslocoPipe],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  public readonly store = inject(CoreStore);
  public readonly lang = inject(LanguageService);
  private readonly _announcer = inject(LiveAnnouncer);
  private readonly _elementRef = inject(ElementRef);

  /** Mobile nav open/close (replaces Bootstrap's collapse plugin). */
  public readonly menuOpen = signal(false);
  /** User dropdown open/close (replaces Bootstrap's dropdown plugin). */
  public readonly userMenuOpen = signal(false);

  constructor() {
    this.store.restoreLogin();

    effect((): void => {
      const user = this.store.userInfo();
      if (user) {
        this._announcer.announce(`Logged in as ${user.name}`, 'polite');
      } else {
        this._announcer.announce('Logged out', 'polite');
      }
    });
  }

  public toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  public closeMenu(): void {
    this.menuOpen.set(false);
  }

  public toggleUserMenu(): void {
    this.userMenuOpen.update((open) => !open);
  }

  public handleLogin(): void {
    this.store.login();
  }

  public handleLogout(): void {
    this.userMenuOpen.set(false);
    this.store.logout();
    this._focusHome();
  }

  /** Close the open menus when clicking anywhere outside the header. */
  @HostListener('document:click', ['$event.target'])
  public onDocumentClick(target: EventTarget | null): void {
    if (target instanceof Node && !this._elementRef.nativeElement.contains(target)) {
      this.userMenuOpen.set(false);
      this.menuOpen.set(false);
    }
  }

  private _focusHome(): void {
    const brand = document.querySelector('.navbar-brand') as HTMLElement;
    brand?.focus();
  }
}
