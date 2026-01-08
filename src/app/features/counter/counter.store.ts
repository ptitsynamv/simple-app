import { computed, effect } from '@angular/core';
import {
  getState,
  patchState,
  signalStore,
  watchState,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

type CounterState = {
  count: number;
};

const initialState: CounterState = {
  count: 0,
};

export const CounterStore = signalStore(
  withState(initialState),
  withComputed(({ count }) => ({
    doubleCount: computed(() => count() * 2),
  })),
  withMethods((store) => ({
    increment(): void {
      patchState(store, (state) => ({ count: state.count + 1 }));
    },
    decrement(): void {
      patchState(store, (state) => ({ count: Math.max(0, state.count - 1) }));
    },
    reset(): void {
      patchState(store, { count: 0 });
    },
  })),
  withHooks({
    onInit(store) {
      watchState(store, (state) => {
        console.log('[watchState] counter state', state);
      }); // logs: { count: 0 }, { count: 1 }, { count: 2 }

      effect(() => {
        console.log('[effect] counter state', getState(store));
      }); // logs: { count: 2 }

      store.increment();
      store.increment();
    },
  })
);
