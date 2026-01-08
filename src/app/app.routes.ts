import { Routes } from '@angular/router';
import { BookTable } from './features/books/components/book-table/book-table';

export const routes: Routes = [
  { path: '', redirectTo: '/books-shell', pathMatch: 'full' },

  {
    path: 'books-shell',
    loadComponent: () =>
      import('./features/books/components/books-shell/books-shell').then((m) => m.BooksShell),
  },
  {
    path: 'counter',
    loadComponent: () =>
      import('./features/counter/components/counter-page/counter-page').then((m) => m.CounterPage),
  },
];
