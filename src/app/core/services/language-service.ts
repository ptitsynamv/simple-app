import { inject, Injectable, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { StorageService } from './storage-service';

const LANG_STORAGE_KEY = 'app-lang';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly _transloco = inject(TranslocoService);
  private readonly _storage = inject(StorageService);

  public readonly activeLang = signal(this._transloco.getActiveLang());

  /** Re-applies the language persisted from a previous visit, if any. */
  public restore(): void {
    const stored = this._storage.getItem(LANG_STORAGE_KEY);
    const available = this._transloco.getAvailableLangs() as string[];
    if (stored && available.includes(stored)) {
      this.setLanguage(stored);
    }
  }

  public setLanguage(lang: string): void {
    this._transloco.setActiveLang(lang);
    this._storage.setItem(LANG_STORAGE_KEY, lang);
    this.activeLang.set(lang);
  }
}
