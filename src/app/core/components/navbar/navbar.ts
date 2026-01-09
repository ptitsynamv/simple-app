import { Component, inject } from '@angular/core';
import { AppStore } from '../../stores/app.store';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  readonly store = inject(AppStore);

  constructor() {
    this.store.login();
  }
}
