import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withLinkedState,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { computed, inject, linkedSignal } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap, tap, pipe, interval } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Book, BookOrder } from './book.interface';
import { BookService } from './services/book';

type BookState = {
  books: Book[];
  isLoading: boolean;
  filter: { query: string; order: BookOrder };
  selectedId: string | null;
};

const initialState: BookState = {
  books: [],
  isLoading: false,
  filter: { query: '', order: 'asc' },
  selectedId: null,
};

export const BookStore = signalStore(
  withState(initialState),
  withProps(() => ({
    booksService: inject(BookService),
  })),
  withLinkedState(({ books, selectedId, ...store }) => ({
    selectedBook: () => {
      return books().find((b) => b.id === selectedId()) ?? null;
    },
  })),
  withComputed(({ books, filter }) => ({
    visibleBooks: computed(() => {
      const direction = filter.order() === 'asc' ? 1 : -1;
      const query = filter.query().toLowerCase();
      return books()
        .filter((book) => book.title.toLowerCase().includes(query))
        .sort((a, b) => direction * a.title.localeCompare(b.title));
    }),
  })),
  withMethods(({ booksService, ...store }) => ({
    updateQueryDebounced$: rxMethod<string>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((query) => {
          patchState(store, (state) => ({
            filter: { ...state.filter, query },
          }));
        })
      )
    ),
    updateOrder(order: BookOrder): void {
      patchState(store, (state) => ({
        filter: { ...state.filter, order },
      }));
    },
    loadByQuery: rxMethod<string>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, { isLoading: true })),
        switchMap((query) => {
          return booksService.getByQuery(query).pipe(
            tapResponse({
              next: (books: Book[]) => patchState(store, { books }),
              error: console.error,
              finalize: () => patchState(store, { isLoading: false }),
            })
          );
        })
      )
    ),
    selectBook(id: string | null) {
      patchState(store, { selectedId: id });
    },
  }))
);
