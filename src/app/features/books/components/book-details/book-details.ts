import { Component, inject, OnInit } from '@angular/core';
import { BookStore } from '../../books.store';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './book-details.html',
  styleUrl: './book-details.scss',
})
export class BookDetails implements OnInit {
  readonly store = inject(BookStore);

  ngOnInit() {}
}
