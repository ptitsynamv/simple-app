import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';

type CounterState = {
  count: number;
};

const initialState: CounterState = {
  count: 0,
};

export const CounterStore = signalStore(
  withState(initialState),
  withHooks({
    onInit(store) {
      console.log('CounterState on init');
    },
    onDestroy(store) {
      console.log('CounterState on destroy');
    },
  })
);
