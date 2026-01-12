import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { User } from '../../shared/interfaces/user.interfaces';
import { CoreService } from '../services/core-service';
import { withLastFocusedElement } from './a11y.store';
import { setError, setFulfilled, setPending, withRequestStatus } from './request-status.store';

type AppState = {
  userInfo: User | null;
};

const initialState: AppState = {
  userInfo: null,
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps(() => ({
    coreService: inject(CoreService),
  })),
  withRequestStatus(),
  withLastFocusedElement(),
  withMethods(({ coreService, ...store }) => ({
    login: rxMethod<void>(
      pipe(
        tap(() => patchState(store, setPending())),
        switchMap(() => {
          return coreService.getUserInfo().pipe(
            tapResponse({
              next: (data) => patchState(store, { userInfo: data }),
              error: (error: Error) => patchState(store, setError(error.message)),
              finalize: () => patchState(store, setFulfilled()),
            })
          );
        })
      )
    ),
    logout: () => {
      patchState(store, { userInfo: null });
    },
  }))
);
