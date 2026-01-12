import { Component, inject } from '@angular/core';
import { BookStore } from '@features/books/books.store';
import { BookDetails } from '../book-details/book-details';
import { BookTable } from '../book-table/book-table';

@Component({
  selector: 'app-books-shell',
  imports: [BookTable, BookDetails],
  providers: [BookStore],
  templateUrl: './books-shell.html',
  styleUrl: './books-shell.scss',
})
export class BooksShell {
  public readonly store = inject(BookStore);

  constructor() {
    this.store.loadBooks();
  }
}
