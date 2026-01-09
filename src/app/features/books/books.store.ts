import {
  patchState,
  signalStore,
  withComputed,
  withLinkedState,
  withMethods,
  withProps,
  withState,
  type,
} from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap, tap, pipe, filter } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { Book, BookOrder } from './book.interface';
import { BookService } from './services/book';
import {
  setError,
  setFulfilled,
  setPending,
  withRequestStatus,
} from '../../core/stores/request-status.store';
import {
  eventGroup,
  on,
  ReducerEvents,
  withEventHandlers,
  withReducer,
} from '@ngrx/signals/events';
import { LiveAnnouncer } from '@angular/cdk/a11y';

type BookState = {
  books: Book[];
  filter: { query: string; order: BookOrder };
  selectedId: string | null;
};

const initialState: BookState = {
  books: [],
  filter: { query: '', order: 'asc' },
  selectedId: null,
};

export const bookSearchEvents = eventGroup({
  source: 'Book Search Page',
  events: {
    queryChanged: type<{ query: string }>(),
    orderChanged: type<{ order: BookOrder }>(),
  },
});

export const BookStore = signalStore(
  withState(initialState),
  withRequestStatus(),
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
    _announcer: inject(LiveAnnouncer),
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
  withMethods(({ _booksService, _announcer, ...store }) => ({
    loadBooks: rxMethod<void>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, setPending())),
        switchMap(() => {
          return _booksService.getByQuery().pipe(
            tapResponse({
              next: (books: Book[]) => {
                patchState(store, { books });
                _announcer.announce(`Loaded ${books.length} books`);
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
  }))
);
