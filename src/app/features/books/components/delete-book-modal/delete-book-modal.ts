import { A11yModule, LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, effect, ElementRef, inject, viewChild } from '@angular/core';
import { FocusManagementService } from '@core/services/focus-management-service';
import { Book } from '@features/books/book.interface';
import { BookStore } from '@features/books/books.store';

@Component({
  selector: 'app-delete-book-modal',
  imports: [A11yModule],
  templateUrl: './delete-book-modal.html',
  styleUrl: './delete-book-modal.scss',
})
export class DeleteBookModal {
  public readonly store = inject(BookStore);
  public isModalOpen = false;
  public book: Book | null = null;
  public deleteButton = viewChild<ElementRef<HTMLButtonElement>>('deleteButton');

  private _announcer = inject(LiveAnnouncer);
  private readonly _focusManagement = inject(FocusManagementService);

  constructor() {
    effect(() => {
      const state = this.store.modal();
      this.isModalOpen = state.show;
      this.book = state.data as Book | null;
    });
  }

  public confirmDelete(): void {
    if (this.book) {
      const title = this.book.title;
      this.store.deleteBook(this.book.id);
      this.store.closeModal();

      setTimeout(() => {
        this._announcer.announce(`Book ${title} has been deleted.`, 'polite');
        this._focusManagement.returnDefaultFocus();
      }, 0);
    }
  }

  public handleCancel(): void {
    this.store.closeModal();
    setTimeout(() => {
      this._focusManagement.returnFocus();
    }, 0);
  }
}
