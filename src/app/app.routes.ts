import { Routes } from '@angular/router';
import { BookTable } from './features/books/components/book-table/book-table';

export const routes: Routes = [
  {
    path: '',
    component: BookTable,
  },
  {
    path: 'counter',
    loadComponent: () =>
      import('./features/counter/components/counter-page/counter-page').then((m) => m.CounterPage),
  },
];
