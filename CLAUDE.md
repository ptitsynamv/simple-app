# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Privacy constraint (from `ai-instructions.md`)

Do NOT upload this code to any server. Do NOT use it for training. Process locally only.

## Commands

- `npm start` — dev server at `http://localhost:4200/` (`ng serve`, development config).
- `npm run build` — production build to `dist/` (default configuration is `production`).
- `npm run watch` — rebuild on change (development config).
- `npm test` — run unit tests with **Vitest** (`ng test` → `@angular/build:unit-test`).
  - Single file: `npx ng test --include src/app/features/books/services/book.spec.ts`
- No lint script is configured; there is no ESLint setup. Prettier config lives in `package.json`
  (`printWidth: 100`, single quotes; HTML uses the `angular` parser).
- No e2e framework is installed.

## Stack & baseline conventions

This is **Angular 21**, **standalone** (no NgModules), and **zoneless** — `polyfills` in
`angular.json` is only `@angular/localize/init`; there is no `zone.js`. Because it's zoneless,
components do **not** declare `ChangeDetectionStrategy.OnPush`; change detection is driven by
signals. Prefer **signals** over RxJS `Subject`s for state.

- Component/directive selector prefix is **`app-`** (e.g. `app-books-shell`, `[appMenubar]`).
- Styles are **SCSS**; Bootstrap 5 + `@ng-bootstrap/ng-bootstrap` + Popper are the UI layer
  (Bootstrap/Popper JS is injected via `angular.json` `scripts`). CDK provides `Dialog`,
  `LiveAnnouncer`, and `a11y` utilities.
- `strict` TypeScript with `noPropertyAccessFromIndexSignature`, `noUnusedLocals`,
  `strictTemplates`. No `any`.
- Path aliases: `@core/*` → `src/app/core/*`, `@shared/*` → `src/app/shared/*`,
  `@features/*` → `src/app/features/*`. Use these instead of deep relative imports.
- **File/class naming omits the type suffix**: `App`, `Header`, `BooksShell`, `BookService`
  in files `app.ts`, `header.ts`, `books-shell.ts`, `services/book.ts` — not
  `*.component.ts` / `FooComponent`. Match this when adding files. Specs are `*.spec.ts`
  co-located (mostly the CLI's default "should be created" stubs).

> Note: the global `~/.claude/rules/angular.md` targets a *different* project (Angular 16 +
> classic NgRx + PrimeNG, `slg` prefix, Ermes i18n). Where it conflicts with what's above,
> follow this repo: `app-` prefix, `@ngrx/signals` (not classic store/effects), no PrimeNG,
> no `$localize` strings yet.

## Architecture

Feature-based layout under `src/app/`: `core/` (app-wide services, stores, components,
directives), `shared/` (cross-feature interfaces), and `features/<feature>/` (self-contained
feature slices). Routing (`app.routes.ts`) lazy-loads every feature via `loadComponent`;
`/` redirects to `/books-shell`. App bootstraps standalone from `main.ts` → `app.config.ts`.

### State: `@ngrx/signals` SignalStore (the core pattern)

All state is `signalStore(...)`, not classic NgRx actions/reducers/effects. Two kinds:

- **Global stores** — `{ providedIn: 'root' }`: `CoreStore` (auth/user), `BookStore`
  (`@features/books/books.store.ts`), plus `CounterStore` (component-provided, a demo).
- **Reusable store features** — `signalStoreFeature(...)` composed into stores:
  - `withRequestStatus()` (`core/stores/request-status.store.ts`) — `requestStatus` +
    `isPending`/`isFulfilled`/`error` computeds. Mutate with the exported `setPending()`,
    `setFulfilled()`, `setError(msg)` helpers passed to `patchState`.
  - `withModal()` (`core/stores/modal.store.ts`) — modal open/close + data.
  - `withLastFocusedElement()` (`core/stores/a11y.store.ts`) — focus capture/restore state.

`BookStore` is the reference for advanced usage: `withComputed` (derived `visibleBooks`
filter/sort), `withLinkedState`, event-driven updates via `eventGroup`/`on`/`withReducer`/
`withEventHandlers` (e.g. debounced search `bookSearchEvents.queryChanged`), and async via
`rxMethod` + `tapResponse` (`loadBooks`, `getBookById`). Follow these patterns when extending
stores. Components consume stores through `inject(SomeStore)` and read signals in templates.

### Async data

`BookService` and `CoreService` are **in-memory mocks** returning `of(...).pipe(delay(...))` —
there is no HTTP backend. Add real endpoints via these services if wiring a backend.

### Accessibility is a first-class concern

WCAG 2.1 AA is a stated project goal (`.github/copilot-instructions.md`). Existing patterns to
reuse: `FocusManagementService` + `withLastFocusedElement` for save/restore focus around
CDK dialogs; `FocusInvalid` directive (`form[appFocusInvalid]`) focuses/announces the first
invalid control on submit; `MenubarDirective` implements arrow-key roving focus; `App`
provides skip-to-content; `LiveAnnouncer` announces auth changes. `PageTitleStrategy` sets
per-route `<title>` as `"<route title> - Simple App"`. Preserve ARIA roles, labels, and focus
management when editing templates.
