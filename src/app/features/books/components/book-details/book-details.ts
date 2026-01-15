import { LiveAnnouncer } from '@angular/cdk/a11y';
import { NgClass } from '@angular/common';
import { Component, computed, ElementRef, inject, viewChild } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { FocusManagementService } from '@core/services/focus-management-service';
import { BookStore } from '@features/books/books.store';
import { pairwise } from 'rxjs/operators';

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
    toObservable(this.store.selectedId)
      .pipe(pairwise())
      .subscribe(([prev, last]) => {
        setTimeout(() => {
          const input = this.editTitleInput()?.nativeElement;
          if (input && last !== null) {
            input.focus();
          }
        }, 0);
      });
  }

  public readonly isDirty = computed(() => {
    return this.store.editTitle() !== this.store.selectedBook()?.title;
  });

  public onUpdateBook(id: string, info: Partial<Record<'isRead' | 'isFavorite', boolean>>) {
    this.store.updateBookInfo(id, info);
    this._announcer.announce('Book information updated', 'polite');
  }

  public onSaveTitle(): void {
    if (this.isDirty()) {
      this.store.saveTitle();
      this._announcer.announce('Book title saved', 'polite');

      this.store.selectBook(null);
      this._focusManagement.returnFocus();
    }
  }
}
