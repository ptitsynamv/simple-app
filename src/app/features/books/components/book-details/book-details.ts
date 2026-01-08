import { Component, inject, OnInit } from '@angular/core';
import { BookStore } from '../../books.store';

@Component({
  selector: 'app-book-details',
  imports: [],
  templateUrl: './book-details.html',
  styleUrl: './book-details.scss',
})
export class BookDetails implements OnInit {
  readonly store = inject(BookStore);

  ngOnInit() {}
}
