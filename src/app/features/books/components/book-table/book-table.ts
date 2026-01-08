import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { BookStore } from '../../books.store';

@Component({
  selector: 'app-book-table',
  imports: [NgClass],
  templateUrl: './book-table.html',
  styleUrl: './book-table.scss',
  providers: [BookStore],
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
}
