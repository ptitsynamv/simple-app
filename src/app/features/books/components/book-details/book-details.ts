import { LiveAnnouncer } from '@angular/cdk/a11y';
import { NgClass } from '@angular/common';
import { Component, effect, ElementRef, inject, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FocusManagementService } from '@core/services/focus-management-service';
import { BookStore } from '@features/books/books.store';

@Component({
  selector: 'app-book-details',
  imports: [FormsModule, NgClass],
  templateUrl: './book-details.html',
  styleUrl: './book-details.scss',
})
export class BookDetails {
  public readonly store = inject(BookStore);
  public editTitleInput = viewChild<ElementRef<HTMLInputElement>>('editTitleInput');
  private readonly _announcer = inject(LiveAnnouncer);
  private readonly _focusManagement = inject(FocusManagementService);

  constructor() {
    effect((): void => {
      const input = this.editTitleInput()?.nativeElement;
      if (input) {
        input.focus();
      }
    });
  }

  public onUpdateBook(id: string, info: Partial<Record<'isRead' | 'isFavorite', boolean>>) {
    this.store.updateBookInfo(id, info);
    this._announcer.announce('Book information updated', 'polite');
  }

  public onSaveTitle(): void {
    this.store.saveTitle();
    this.store.selectBook(null);
    this._announcer.announce('Book title saved', 'polite');
    this._focusManagement.returnFocus();
  }
}
