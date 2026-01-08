import { inject, OnInit } from '@angular/core';
import {
  patchState,
  signalStore,
  withHooks,
  withLinkedState,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { CoreService } from '../services/core-service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

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
  withProps(() => ({
    coreService: inject(CoreService),
  })),
  withMethods(({ coreService, ...store }) => ({
    login: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() => {
          return coreService.getUserName().pipe(
            tapResponse({
              next: (name: string) => patchState(store, { user: { name }, isAuthenticated: true }),
              error: console.error,
              finalize: () => patchState(store, { isLoading: false }),
            })
          );
        })
      )
    ),
  }))
);
