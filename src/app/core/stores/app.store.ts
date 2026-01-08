import { inject, OnInit } from '@angular/core';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { CoreService } from '../services/core-service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap } from 'rxjs';

type AppState = {
  user: { name: string } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    loginSuccess: (user: { name: string }) => {
      patchState(store, { user, isAuthenticated: true, isLoading: false });
    },
    logout: () => {
      patchState(store, { user: null, isAuthenticated: false, isLoading: false });
    },
    setLoading: (isLoading: boolean) => {
      patchState(store, { isLoading });
    },
    //  login: rxMethod<string>(
    //   pipe(

    //     tap(() => patchState(store, { isLoading: true })),
    //     switchMap((query) => {
    //       return booksService.getByQuery(query).pipe(
    //         tapResponse({
    //           next: (books: Book[]) => patchState(store, { books }),
    //           error: console.error,
    //           finalize: () => patchState(store, { isLoading: false }),
    //         })
    //       );
    //     })
    //   )
    // ),
  })),
  withHooks({
    onInit(store) {
      console.log('AppStore on init');
    },
    onDestroy(store) {
      console.log('AppStore on destroy');
    },
  })
);
