# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Privacy constraint (from `ai-instructions.md`)

Do NOT upload this code to any server. Do NOT use it for training. Process locally only.

## Feature List Rules
- Feature list file: /docs/features.md
- Only one feature active at a time
- Verification command must pass before marking as passing
- Don't modify feature list states yourself — the verification script updates them automatically

## Definition of Done
- Feature complete = end-to-end verification passed, not "code is written"
- Required verification levels:
  1. Unit tests pass
  2. Integration tests pass
  3. End-to-end flow verification passes
- Do not proceed to level 2 if level 1 fails
- Do not proceed to level 3 if level 2 fails

> Current reality: `docs/features.md` holds only a placeholder entry (a cart API that doesn't
> exist here), there is no verification script, and only unit tests (Vitest) exist — no
> integration or e2e setup. Don't invent results for levels that have no tooling; say so.

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
`angular.json` is empty; there is no `zone.js`. Because it's zoneless, existing components do
**not** declare `ChangeDetectionStrategy.OnPush`; change detection is driven by signals. Prefer
**signals** over RxJS `Subject`s for state. Use `inject()` (not constructor injection),
`input()`/`output()`, and native `@if`/`@for` control flow.

- Component/directive selector prefix is **`app-`** (e.g. `app-books-shell`, `[appMenubar]`).
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
> Transloco (not `$localize`) for i18n, Tailwind for styling.
>
> `AGENTS.md` also says every component must set `OnPush`, but none do; follow the existing
> code and point out the mismatch instead of silently adding it everywhere. The
> `simple-app-frontend` skill (`.claude/skills/`) holds the detailed conventions. Load it before
> making feature changes.

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
(`provideHttpClient()` is registered, but today it is only used to load translation files.)

### i18n: Transloco

`provideTransloco` in `app.config.ts` sets `availableLangs: ['en', 'it']` with `en` as the
default. `TranslocoHttpLoader` fetches `/i18n/<lang>.json`, which is served from
`public/i18n/`. Add each new key to **both** `en.json` and `it.json`. Templates use
`TranslocoPipe` (`{{ 'key' | transloco }}`). `LanguageService` (`core/services`) switches
the language, stores the choice through `StorageService`, and exposes `activeLang` as a
signal. `App` calls `restore()` on startup. So far only the app shell (header, footer, app)
is translated; feature templates still contain hard-coded English strings.

### Styling: Tailwind CSS v4

Tailwind v4 runs through PostCSS (`.postcssrc.json` → `@tailwindcss/postcss`), and
`src/styles.scss` loads it with `@use "tailwindcss"`. Templates are styled mostly with utility
classes, and component `.scss` files are small. Bootstrap has been removed, but `angular.json`
still loads the Popper UMD script as a leftover. Global focus styles in `styles.scss`
(a 4px lime outline) are part of the accessibility baseline, so don't override them.

### Accessibility is a first-class concern

WCAG 2.1 AA is a stated project goal (`.github/copilot-instructions.md`). Existing patterns to
reuse: `FocusManagementService` + `withLastFocusedElement` for save/restore focus around
CDK dialogs; `FocusInvalid` directive (`form[appFocusInvalid]`) focuses/announces the first
invalid control on submit; `MenubarDirective` implements arrow-key roving focus; `App`
provides skip-to-content; `LiveAnnouncer` announces auth changes. `PageTitleStrategy` sets
per-route `<title>` as `"<route title> - Simple App"`. Preserve ARIA roles, labels, and focus
management when editing templates.
