import { Component, inject } from '@angular/core';
import { CounterStore } from '../../counter.store';
import { getState } from '@ngrx/signals';

@Component({
  selector: 'app-counter-page',
  imports: [],
  templateUrl: './counter-page.html',
  styleUrl: './counter-page.scss',
  providers: [CounterStore],
})
export class CounterPage {
  public readonly store = inject(CounterStore);

  constructor() {
    (window as any).debugStore = () => console.log(getState(this.store));
  }
}
