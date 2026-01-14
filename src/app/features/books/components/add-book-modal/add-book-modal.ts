import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FocusInvalid } from '@core/directives/focus-invalid';
import { BookStore } from '@features/books/books.store';

@Component({
  selector: 'app-add-book-modal',
  standalone: true,
  imports: [ReactiveFormsModule, FocusInvalid],
  templateUrl: './add-book-modal.html',
  styleUrl: './add-book-modal.scss',
})
export class AddBookModal {
  public readonly store = inject(BookStore);
  private readonly _fb = inject(FormBuilder);
  private dialogRef = inject(DialogRef);
  private announcer = inject(LiveAnnouncer);

  public bookForm: FormGroup = this._fb.group({
    title: ['', [Validators.required, Validators.maxLength(50)]],
    isRead: [false],
    isFavorite: [false],
  });

  public handleSave(): void {
    if (this.bookForm.valid) {
      const bookData = this.bookForm.value;
      this.store.addBook(bookData);

      this.announcer.announce(`Book ${bookData.title} added successfully`, 'polite');
      this.handleCancel();
    }
  }

  public handleCancel(): void {
    this.dialogRef.close();
  }
}
