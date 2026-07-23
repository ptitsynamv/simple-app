# Simple App frontend — reference

Detailed patterns for this repo. Read the section for whatever you're changing, then match
the existing files exactly. Canonical examples are cited by path.

---

## SignalStore

All state is `signalStore(...)` from `@ngrx/signals`. There are two shapes.

### Global store (`{ providedIn: 'root' }`)

Reference: `src/app/features/books/books.store.ts` (advanced), `src/app/core/stores/core.store.ts`
(async login).

```ts
export const BookStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withRequestStatus(),               // reusable feature — see below
  withModal(),
  withProps(() => ({ _booksService: inject(BookService) })),
  withComputed(({ books, filter }) => ({
    visibleBooks: computed(() => /* derive, don't store */),
  })),
  withMethods(({ _booksService, ...store }) => ({
    // sync mutation
    selectBook(id: string | null): void {
      patchState(store, { selectedId: id });
    },
    // immutable array update
    addBook(book: CreateBook): void {
      patchState(store, (state) => ({ books: [...state.books, { id: '...', ...book }] }));
    },
  })),
);
```

Rules:
- Mutate only via `patchState(store, partial)` or `patchState(store, (state) => partial)`.
- Updates are **immutable** (`[...books]`, `books.map(...)`, `{ ...b }`).
- Derived data lives in `withComputed`, never duplicated into state.
- Inject dependencies through `withProps(() => ({ _svc: inject(Svc) }))`; `_`-prefix them.
- Components consume via `inject(BookStore)` and read signals in the template
  (`store.visibleBooks()`).

### Reusable store feature (`signalStoreFeature`)

Compose cross-cutting state into any store. Existing ones — reuse these before writing new state:

| Feature | File | Provides |
| --- | --- | --- |
| `withRequestStatus()` | `core/stores/request-status.store.ts` | `requestStatus` + `isPending`/`isFulfilled`/`error`; helpers `setPending()`, `setFulfilled()`, `setError(msg)` for `patchState` |
| `withModal()` | `core/stores/modal.store.ts` | `modal.show`/`modal.data`, `openModal(data)`, `closeModal()` |
| `withLastFocusedElement()` | `core/stores/a11y.store.ts` | focus capture/restore state |

New reusable feature skeleton:

```ts
export function withThing() {
  return signalStoreFeature(
    withState<ThingState>({ ... }),
    withComputed(...),   // optional
    withMethods((store) => ({ ... })),
  );
}
```

### Events (advanced — books search)

`BookStore` uses `eventGroup` + `withReducer`/`withEventHandlers` for debounced search. Follow
`bookSearchEvents` in `books.store.ts` when adding event-driven flows; components dispatch via
the injected `Events`/emitters. Don't reach for this unless you need decoupled event handling —
a plain `withMethods` method is the default.

---

## Async

`BookService` / `CoreService` are **in-memory mocks** (`of(...).pipe(delay(...))`) — there is no
HTTP backend for domain data. To add async, put it in a service and consume with `rxMethod`:

```ts
loadBooks: rxMethod<void>(
  pipe(
    tap(() => patchState(store, setPending())),
    switchMap(() =>
      _booksService.getAllBooks().pipe(
        tapResponse({
          next: (books) => patchState(store, { books }),
          error: (e: Error) => patchState(store, setError(e.message)),
          finalize: () => patchState(store, setFulfilled()),
        }),
      ),
    ),
  ),
),
```

- `switchMap` for latest-wins (search/reload); pick `exhaustMap`/`concatMap` per cancellation need.
- Always wrap the inner call in `tapResponse` and drive `withRequestStatus` from it.
- `HttpClient` **is** provided (added for Transloco) — use `provideHttpClient` is already in
  `app.config.ts`; inject `HttpClient` in a service if wiring a real backend.

---

## i18n (Transloco)

Setup lives in `app.config.ts` (`provideTransloco`) + `core/services/transloco-loader.ts`
(fetches `/i18n/{lang}.json`). Languages: `en` (default) and `it`.

### Adding / changing a string

1. Add the key to **both** `public/i18n/en.json` and `public/i18n/it.json` (keep the nested
   structure: `nav`, `header`, `auth`, `language`, `footer`, `a11y`). Missing a lang = the key
   text shows verbatim.
2. In the component `@Component({ imports: [...] })`, add `TranslocoPipe` (from
   `@jsverse/transloco`).
3. Use it:
   - Text: `{{ 'nav.books' | transloco }}`
   - Attributes / a11y: `[attr.aria-label]="'auth.loginAria' | transloco"`

### Switching / persisting language

Use `LanguageService` (`core/services/language-service.ts`) — do **not** call `TranslocoService`
directly from components:

```ts
public readonly lang = inject(LanguageService);
// template: lang.activeLang() reads current; lang.setLanguage('it') switches + persists
```

`LanguageService` persists the choice via `StorageService` (`localStorage` key `app-lang`) and
`App` calls `lang.restore()` in its constructor so it survives reloads. The switcher UI lives in
`core/components/header/header.html`.

### Adding a new language

1. Create `public/i18n/<code>.json` with all keys translated.
2. Add `<code>` to `availableLangs` in `app.config.ts`.
3. Add a `language.<code>` label to every `*.json` and a switcher button in the header.

### Not yet translated (known gaps)

Feature pages (books table/modals, counter) and **route titles** in `app.routes.ts` still have
hardcoded English. Translating titles needs `PageTitleStrategy` to run values through Transloco
with care around async load timing.

---

## Accessibility (WCAG 2.1 AA)

Stated project goal. Reuse the existing building blocks — don't reinvent:

- **Focus save/restore around CDK dialogs**: `FocusManagementService` + `withLastFocusedElement()`.
  See `books-shell.ts` `openAddModal()` (save focus → open `Dialog` → restore on `closed`).
- **First invalid control on submit**: `FocusInvalid` directive (`form[appFocusInvalid]`) focuses,
  scrolls to, and announces the first invalid field.
- **Roving arrow-key focus in menus**: `MenubarDirective` (`[appMenubar]`, items `role="menuitem"`).
- **Skip-to-content**: implemented in `App` / `app.html`.
- **Async status announcements**: `LiveAnnouncer` (e.g. `Header` announces login/logout).
- **Per-route title**: `PageTitleStrategy` sets `"<route title> - Simple App"`.

When editing templates: real `<button>`/`<a>` (not click `<div>`s), every input has a `<label>`,
icon-only controls get an `aria-label` (via `| transloco`), don't drop focus outlines.

---

## Testing & tooling

- **Vitest** (`ng test` → `@angular/build:unit-test`). Specs co-located as `*.spec.ts`, mostly
  CLI "should be created" stubs.
- Single file: `npx ng test --include src/app/features/books/services/book.spec.ts`.
- No ESLint. Prettier config in `package.json` (`printWidth: 100`, single quotes; HTML → angular
  parser).
- **Build/serve need Node 20+** (`nvm use 22.22.3`); the repo's default shell may be on Node 18.
- Production bundle currently exceeds the 500 kB initial budget warning (Bootstrap CSS dominates) —
  a warning, not an error.
