import { Component, inject, OnInit } from '@angular/core';
import { BookStore } from '../../books.store';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './book-details.html',
  styleUrl: './book-details.scss',
})
export class BookDetails {
  readonly store = inject(BookStore);
  private readonly _announcer = inject(LiveAnnouncer);

  public onUpdateBook(id: string, info: Partial<Record<'isRead' | 'isFavorite', boolean>>) {
    this.store.updateBookInfo(id, info);
    this._announcer.announce('Book information updated', 'polite');
  }

  public onSaveTitle() {
    this.store.saveTitle();
    this._announcer.announce('Book title saved', 'polite');
  }
}
