import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
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
  }))
);
