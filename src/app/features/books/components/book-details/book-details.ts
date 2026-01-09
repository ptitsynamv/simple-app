import { Component, inject, OnInit } from '@angular/core';
import { BookStore } from '../../books.store';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './book-details.html',
  styleUrl: './book-details.scss',
})
export class BookDetails implements OnInit {
  readonly store = inject(BookStore);

  ngOnInit() {}
}
