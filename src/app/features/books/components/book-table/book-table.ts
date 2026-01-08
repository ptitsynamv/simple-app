import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { BookStore } from '../../books.store';

@Component({
  selector: 'app-book-table',
  templateUrl: './book-table.html',
  styleUrl: './book-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookTable implements OnInit {
  readonly store = inject(BookStore);

  constructor() {
    const query = this.store.filter.query;
    this.store.loadByQuery(query);
  }

  public ngOnInit(): void {}

  public onChangeOrder() {
    const newOrder = this.store.filter.order() === 'asc' ? 'desc' : 'asc';
    this.store.updateOrder(newOrder);
  }

  public selectBook(bookId: string): void {
    this.store.selectBook(bookId);
  }
}
