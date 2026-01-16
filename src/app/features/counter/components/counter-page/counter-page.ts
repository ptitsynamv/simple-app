import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, effect, inject } from '@angular/core';
import { CounterStore } from '@features/counter/counter.store';
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
  private readonly announcer = inject(LiveAnnouncer);

  constructor() {
    (window as any).debugStore = () => console.log(getState(this.store));

    effect(() => {
      const count = this.store.count();
      this.announcer.announce(`Counter is now ${count}`, 'polite');
    });
  }
}
