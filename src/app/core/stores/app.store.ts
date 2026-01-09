import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { CoreService } from '../services/core-service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { setError, setFulfilled, setPending, withRequestStatus } from './request-status.store';

type AppState = {
  user: { name: string } | null;
  isAuthenticated: boolean;
};

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps(() => ({
    coreService: inject(CoreService),
  })),
  withRequestStatus(),
  withMethods(({ coreService, ...store }) => ({
    login: rxMethod<void>(
      pipe(
        tap(() => patchState(store, setPending())),
        switchMap(() => {
          return coreService.getUserName().pipe(
            tapResponse({
              next: (name: string) => patchState(store, { user: { name }, isAuthenticated: true }),
              error: (error: Error) => patchState(store, setError(error.message)),
              finalize: () => patchState(store, setFulfilled()),
            })
          );
        })
      )
    ),
  }))
);
