import { inject } from '@angular/core';
import { AuthService } from '@core/services/auth-service';
import { CoreService } from '@core/services/core-service';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { User } from '@shared/interfaces/user.interfaces';
import { pipe, switchMap, tap } from 'rxjs';
import { withLastFocusedElement } from './a11y.store';
import { setError, setFulfilled, setPending, withRequestStatus } from './request-status.store';

type CoreState = {
  userInfo: User | null;
};

const initialState: CoreState = {
  userInfo: null,
};

export const CoreStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps(() => ({
    coreService: inject(CoreService),
    authService: inject(AuthService),
  })),
  withRequestStatus(),
  withLastFocusedElement(),
  withMethods(({ coreService, authService, ...store }) => ({
    login: rxMethod<void>(
      pipe(
        tap(() => patchState(store, setPending())),
        switchMap(() => {
          return coreService.getUserInfo().pipe(
            tapResponse({
              next: (data) => {
                authService.setUserInfo(data);
                patchState(store, { userInfo: data });
              },
              error: (error: Error) => {
                authService.clearUserInfo();
                patchState(store, setError(error.message));
              },
              finalize: () => patchState(store, setFulfilled()),
            })
          );
        })
      )
    ),
    logout: () => {
      authService.clearUserInfo();
      patchState(store, { userInfo: null });
    },
    restoreLogin: () => {
      const userInfo = authService.getUserInfo();
      if (userInfo) {
        patchState(store, { userInfo });
      }
    },
  }))
);
