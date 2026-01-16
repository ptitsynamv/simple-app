import { computed, inject } from '@angular/core';
import { withModal } from '@core/stores/modal.store';
import {
  setError,
  setFulfilled,
  setPending,
  withRequestStatus,
} from '@core/stores/request-status.store';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  type,
  withComputed,
  withLinkedState,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import {
  eventGroup,
  on,
  ReducerEvents,
  withEventHandlers,
  withReducer,
} from '@ngrx/signals/events';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import { Book, BookOrder, CreateBook } from './book.interface';
import { BookService } from './services/book';

type BookState = {
  books: Book[];
  filter: { query: string; order: BookOrder };
  selectedId: string | null;
  readBook: Book | null;
};

const initialState: BookState = {
  books: [],
  filter: { query: '', order: 'asc' },
  selectedId: null,
  readBook: null,
};

export const bookSearchEvents = eventGroup({
  source: 'Book Search Page',
  events: {
    queryChanged: type<{ query: string }>(),
    orderChanged: type<{ order: BookOrder }>(),
  },
});

export const BookStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withRequestStatus(),
  withModal(),
  withReducer(
    on(bookSearchEvents.orderChanged, ({ payload }, state) => ({
      filter: {
        ...state.filter,
        ...payload,
      },
    }))
  ),
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
  withEventHandlers((store, events = inject(ReducerEvents)) => [
    events.on(bookSearchEvents.queryChanged).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(({ payload }) =>
        patchState(store, (state) => ({
          filter: { ...state.filter, ...payload },
        }))
      )
    ),
  ]),
  withMethods(({ _booksService, ...store }) => ({
    loadBooks: rxMethod<void>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, setPending())),
        switchMap(() => {
          return _booksService.getAllBooks().pipe(
            tapResponse({
              next: (books: Book[]) => {
                patchState(store, { books });
              },
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
    addBook(book: CreateBook): void {
      patchState(store, (state) => ({
        books: [...state.books, { id: (state.books.length + 1).toString(), ...book }],
      }));
    },
    deleteBook(id: string): void {
      patchState(store, (state) => ({
        books: state.books.filter((b) => b.id !== id),
      }));
    },
    getBookById: rxMethod<string>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, setPending())),
        switchMap((id) => {
          return _booksService.getById(id).pipe(
            tapResponse({
              next: (book) => {
                patchState(store, { readBook: book });
              },
              error: (error: Error) => patchState(store, setError(error.message)),
              finalize: () => patchState(store, setFulfilled),
            })
          );
        })
      )
    ),
  }))
);
