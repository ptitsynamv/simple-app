import { patchState, signalStoreFeature, withMethods, withState } from '@ngrx/signals';

export type LastFocusedElementState = {
  lastFocus: { lastFocusedElement: HTMLElement | null; defaultFocusedElement: HTMLElement | null };
};

export function withLastFocusedElement() {
  return signalStoreFeature(
    withState<LastFocusedElementState>({
      lastFocus: { lastFocusedElement: null, defaultFocusedElement: null },
    }),
    withMethods((store) => ({
      captureFocus(el: HTMLElement, defaultEl: HTMLElement | null = null) {
        patchState(store, {
          lastFocus: { lastFocusedElement: el, defaultFocusedElement: defaultEl },
        });
      },
      clearFocus() {
        patchState(store, { lastFocus: { lastFocusedElement: null, defaultFocusedElement: null } });
      },
    }))
  );
}
