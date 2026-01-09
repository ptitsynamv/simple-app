import { patchState, signalStoreFeature, withMethods, withState } from '@ngrx/signals';

export type LastFocusedElementState = { lastFocusedElement: HTMLElement | null };

export function withLastFocusedElement() {
  return signalStoreFeature(
    withState<LastFocusedElementState>({ lastFocusedElement: null as HTMLElement | null }),
    withMethods((store) => ({
      captureFocus(el: HTMLElement) {
        patchState(store, { lastFocusedElement: el });
      },
      clearFocus() {
        patchState(store, { lastFocusedElement: null });
      },
    }))
  );
}
