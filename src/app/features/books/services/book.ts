import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Book } from '../book.interface';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  public getByQuery(query: string): Observable<Book[]> {
    const data = [
      { id: '1', title: 'Clean Code' },
      { id: '2', title: 'The Pragmatic Programmer' },
      { id: '3', title: 'You Don’t Know JS' },
      { id: '4', title: 'Design Patterns' },
      { id: '5', title: 'Refactoring' },
      { id: '6', title: 'JavaScript: The Good Parts' },
      { id: '7', title: 'Domain-Driven Design' },
      { id: '8', title: 'Microservices Patterns' },
      { id: '9', title: 'Effective TypeScript' },
      { id: '10', title: 'Angular in Action' },
    ];
    return of(data).pipe(delay(1000));
  }
}
