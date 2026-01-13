import { Dialog } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { FocusManagementService } from '@core/services/focus-management-service';
import { BookStore } from '@features/books/books.store';
import { AddBookModal } from '../add-book-modal/add-book-modal';
import { BookDetails } from '../book-details/book-details';
import { BookTable } from '../book-table/book-table';

@Component({
  selector: 'app-books-shell',
  imports: [BookTable, BookDetails],
  templateUrl: './books-shell.html',
  styleUrl: './books-shell.scss',
})
export class BooksShell {
  public readonly store = inject(BookStore);
  private readonly _dialog = inject(Dialog);
  private readonly _focusManagement = inject(FocusManagementService);

  constructor() {
    this.store.loadBooks();
  }

  public openAddModal(): void {
    this._focusManagement.saveCurrentFocus();

    const dialogRef = this._dialog.open(AddBookModal, {
      restoreFocus: true,
      panelClass: 'modal',
      ariaLabelledBy: 'add-book-modal',
    });

    dialogRef.closed.subscribe((): void => {
      this._focusManagement.returnFocus();
    });
  }
}
