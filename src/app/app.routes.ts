import { Routes } from '@angular/router';
import { BookTable } from './features/books/components/book-table/book-table';

export const routes: Routes = [
  { path: '', redirectTo: '/books', pathMatch: 'full' },
  {
    path: 'books',
    loadComponent: () =>
      import('./features/books/components/book-table/book-table').then((m) => m.BookTable),
  },
  {
    path: 'counter',
    loadComponent: () =>
      import('./features/counter/components/counter-page/counter-page').then((m) => m.CounterPage),
  },
];
