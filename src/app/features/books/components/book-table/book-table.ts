import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FocusManagementService } from '@core/services/focus-management-service';
import { Book } from '@features/books/book.interface';
import { bookSearchEvents, BookStore } from '@features/books/books.store';
import { Dispatcher } from '@ngrx/signals/events';
import { DeleteBookModal } from '../delete-book-modal/delete-book-modal';

@Component({
  selector: 'app-book-table',
  templateUrl: './book-table.html',
  styleUrl: './book-table.scss',
  imports: [DeleteBookModal, RouterLink],
})
export class BookTable {
  public readonly store = inject(BookStore);
  public changeOrderButton = viewChild<ElementRef<HTMLButtonElement>>('changeOrderButton');

  private readonly _dispatcher = inject(Dispatcher);
  private readonly _announcer = inject(LiveAnnouncer);
  private readonly _focusManagement = inject(FocusManagementService);

  public onChangeOrder() {
    const newOrder = this.store.filter.order() === 'asc' ? 'desc' : 'asc';
    this._dispatcher.dispatch(bookSearchEvents.orderChanged({ order: newOrder }));
    this._announcer.announce(`Table sorted by title, ${newOrder}`, 'polite');
  }

  public onUpdateQuery(query: string): void {
    this._dispatcher.dispatch(bookSearchEvents.queryChanged({ query }));
  }

  public selectBook(bookId: string): void {
    this._focusManagement.saveCurrentFocus();
    this.store.selectBook(bookId);
  }

  public deleteBook(book: Book): void {
    this._focusManagement.saveCurrentFocus(this.changeOrderButton()?.nativeElement as HTMLElement);
    this.store.openModal<Book>(book);
  }

  /**
   * https://www.w3.org/WAI/WCAG22/Techniques/general/G123
   */
  public skipToEnd(event: Event, target: HTMLElement): void {
    event.preventDefault();
    target.focus();

    target.scrollIntoView({ behavior: 'smooth' });
  }
}
