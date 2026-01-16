import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/books-shell', pathMatch: 'full' },

  {
    path: 'books-shell',
    loadComponent: () =>
      import('./features/books/components/books-shell/books-shell').then((m) => m.BooksShell),
    title: 'Books Library',
  },
  {
    path: 'counter',
    loadComponent: () =>
      import('./features/counter/components/counter-page/counter-page').then((m) => m.CounterPage),
    title: 'SignalStore Counter',
  },
  {
    path: 'read-book/:id',
    loadComponent: () =>
      import('./features/books/components/read-book/read-book').then((m) => m.ReadBook),
  },
];
