import { ɵNullViewportScroller } from '@angular/common';
import { patchState, signalStoreFeature, withMethods, withState } from '@ngrx/signals';

export type ModalState<T extends object = {}> = {
  modal: {
    show: boolean;
    data: T | null;
  };
};

export function withModal() {
  return signalStoreFeature(
    withState<ModalState>({
      modal: { show: false, data: null },
    }),
    withMethods((store) => ({
      openModal<T extends object>(data: T): void {
        patchState(store, { modal: { show: true, data } });
      },
      closeModal(): void {
        patchState(store, { modal: { show: false, data: ɵNullViewportScroller } });
      },
    }))
  );
}
