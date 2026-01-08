import { Component } from '@angular/core';
import { BookStore } from '../../books.store';
import { BookTable } from '../book-table/book-table';
import { BookDetails } from '../book-details/book-details';

@Component({
  selector: 'app-books-shell',
  imports: [BookTable, BookDetails],
  providers: [BookStore],
  templateUrl: './books-shell.html',
  styleUrl: './books-shell.scss',
})
export class BooksShell {}
