import {
  patchState,
  signalStore,
  withComputed,
  withLinkedState,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap, tap, pipe } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { Book, BookOrder } from './book.interface';
import { BookService } from './services/book';
import {
  setError,
  setFulfilled,
  setPending,
  withRequestStatus,
} from '../../core/stores/request-status.store';

type BookState = {
  books: Book[];
  // isLoading: boolean;
  filter: { query: string; order: BookOrder };
  selectedId: string | null;
};

const initialState: BookState = {
  books: [],
  // isLoading: false,
  filter: { query: '', order: 'asc' },
  selectedId: null,
};

export const BookStore = signalStore(
  withState(initialState),
  withRequestStatus(),
  withProps(() => ({
    _booksService: inject(BookService),
  })),
  withComputed(({ books, filter, selectedId }) => ({
    visibleBooks: computed(() => {
      const direction = filter.order() === 'asc' ? 1 : -1;
      const query = filter.query().toLowerCase();
      return books()
        .filter((book) => book.title.toLowerCase().includes(query))
        .sort((a, b) => direction * a.title.localeCompare(b.title));
    }),
    selectedBook: computed(() => books().find((b) => b.id === selectedId()) ?? null),
  })),
  withLinkedState(({ books, selectedId, selectedBook, ...store }) => ({
    editTitle: () => {
      return selectedBook()?.title ?? '';
    },
  })),
  withMethods(({ _booksService, ...store }) => ({
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
    loadBooks: rxMethod<void>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, setPending())),
        switchMap(() => {
          return _booksService.getByQuery().pipe(
            tapResponse({
              next: (books: Book[]) => patchState(store, { books }),
              error: (error: Error) => patchState(store, setError(error.message)),
              finalize: () => patchState(store, setFulfilled),
            })
          );
        })
      )
    ),
    selectBook(id: string | null) {
      patchState(store, { selectedId: id });
    },
    updateEditTitle(title: string): void {
      patchState(store, { editTitle: title });
    },
    saveTitle(): void {
      const currentId = store.selectedId();
      const newTitle = store.editTitle();

      patchState(store, (state) => ({
        books: state.books.map((b) => (b.id === currentId ? { ...b, title: newTitle } : b)),
      }));
    },
    updateBookInfo(id: string, indo: Partial<Record<'isRead' | 'isFavorite', boolean>>): void {
      patchState(store, (state) => ({
        books: state.books.map((b) => (b.id === id ? { ...b, ...indo } : b)),
      }));
    },
  }))
);
