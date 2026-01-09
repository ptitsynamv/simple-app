import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Book } from '../book.interface';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  public getByQuery(): Observable<Book[]> {
    const data: Book[] = [
      { id: '1', title: 'Clean Code', isRead: false, isFavorite: false },
      { id: '2', title: 'The Pragmatic Programmer', isRead: false, isFavorite: false },
      { id: '3', title: 'You Don’t Know JS', isRead: false, isFavorite: false },
      { id: '4', title: 'Design Patterns', isRead: false, isFavorite: false },
      { id: '5', title: 'Refactoring', isRead: false, isFavorite: false },
      { id: '6', title: 'JavaScript: The Good Parts', isRead: false, isFavorite: false },
      { id: '7', title: 'Domain-Driven Design', isRead: false, isFavorite: false },
      { id: '8', title: 'Microservices Patterns', isRead: false, isFavorite: false },
      { id: '9', title: 'Effective TypeScript', isRead: false, isFavorite: false },
      { id: '10', title: 'Angular in Action', isRead: false, isFavorite: false },
    ];
    return of(data).pipe(delay(1000));
  }
}
