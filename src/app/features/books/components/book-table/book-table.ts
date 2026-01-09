import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { bookSearchEvents, BookStore } from '../../books.store';
import { Dispatcher } from '@ngrx/signals/events';

@Component({
  selector: 'app-book-table',
  templateUrl: './book-table.html',
  styleUrl: './book-table.scss',
})
export class BookTable implements OnInit {
  readonly store = inject(BookStore);
  private readonly _dispatcher = inject(Dispatcher);

  public ngOnInit(): void {}

  public onChangeOrder() {
    const newOrder = this.store.filter.order() === 'asc' ? 'desc' : 'asc';
    this._dispatcher.dispatch(bookSearchEvents.orderChanged({ order: newOrder }));
  }

  public onUpdateQuery(query: string): void {
    this._dispatcher.dispatch(bookSearchEvents.queryChanged({ query }));
  }

  public selectBook(bookId: string): void {
    this.store.selectBook(bookId);
  }
}
