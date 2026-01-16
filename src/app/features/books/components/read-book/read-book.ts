import { Component, effect, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Book } from '@features/books/book.interface';
import { BookStore } from '@features/books/books.store';

@Component({
  selector: 'app-read-book',
  imports: [],
  templateUrl: './read-book.html',
  styleUrl: './read-book.scss',
})
export class ReadBook implements OnInit {
  private _titleService = inject(Title);
  private _route = inject(ActivatedRoute);
  public store = inject(BookStore);
  public book: Book | null = null;

  constructor() {
    effect(() => {
      const book = this.store.readBook();

      if (book) {
        this.book = book;
        this._titleService.setTitle(`${book.title} - Book Details`);
      }
    });
  }

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id');
    if (id) {
      this.store.getBookById(id);
    }
  }
}
