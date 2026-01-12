import { Component, inject, OnInit } from '@angular/core';
import { bookSearchEvents, BookStore } from '../../books.store';
import { Dispatcher } from '@ngrx/signals/events';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FocusManagementService } from '../../../../core/services/focus-management-service';

@Component({
  selector: 'app-book-table',
  templateUrl: './book-table.html',
  styleUrl: './book-table.scss',
})
export class BookTable implements OnInit {
  readonly store = inject(BookStore);
  private readonly _dispatcher = inject(Dispatcher);
  private readonly _announcer = inject(LiveAnnouncer);
  private readonly _focusManager = inject(FocusManagementService);

  public ngOnInit(): void {}

  public onChangeOrder() {
    const newOrder = this.store.filter.order() === 'asc' ? 'desc' : 'asc';
    this._dispatcher.dispatch(bookSearchEvents.orderChanged({ order: newOrder }));
    this._announcer.announce(`Table sorted by title, ${newOrder}`, 'polite');
  }

  public onUpdateQuery(query: string): void {
    this._dispatcher.dispatch(bookSearchEvents.queryChanged({ query }));
  }

  public selectBook(bookId: string): void {
    this.store.selectBook(bookId);
    this._focusManager.saveCurrentFocus();
  }
}
