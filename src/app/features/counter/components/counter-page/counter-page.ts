import { Component, inject } from '@angular/core';
import { CounterStore } from '../../counter.store';

@Component({
  selector: 'app-counter-page',
  imports: [],
  templateUrl: './counter-page.html',
  styleUrl: './counter-page.scss',
  providers: [CounterStore],
})
export class CounterPage {
  private readonly store = inject(CounterStore);
}
