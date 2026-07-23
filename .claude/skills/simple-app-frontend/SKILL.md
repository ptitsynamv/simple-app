---
name: simple-app-frontend
description: >-
  Conventions and architecture for the Simple App Angular frontend (Angular 21,
  standalone, zoneless, @ngrx/signals SignalStore, @jsverse/transloco i18n with
  en/it, WCAG 2.1 AA). Load BEFORE adding or changing
  feature code, SignalStore slices, components/directives, i18n strings, or a11y
  behavior so the change matches existing patterns. Triggers: working in src/app,
  "add a store / signalStoreFeature", "new component", "rxMethod", "withComputed",
  "add a translation", "transloco", "new language", "focus management", build/run.
---

# Simple App frontend

Repo-specific conventions for this Angular study app. This is the concise entry point;
for full code patterns and examples read **[reference.md](reference.md)** (do this before
writing store or i18n code — the APIs are easy to get subtly wrong).

> The global `~/.claude/rules/angular.md` targets a *different* project (Angular 16 + classic
> NgRx + PrimeNG, `slg` prefix, Ermes i18n). Where it conflicts, **this repo wins**.

## Stack essentials

- **Angular 21, standalone, zoneless.** No NgModules. No `zone.js` (polyfills is only
  `@angular/localize/init`). Change detection is signal-driven, so **do NOT add
  `ChangeDetectionStrategy.OnPush`** — it's unnecessary here.
- **State = `@ngrx/signals` SignalStore**, never classic actions/reducers/effects. Prefer
  signals over RxJS `Subject`s.
- **i18n**: `@jsverse/transloco`, langs `en` + `it`, JSON in `public/i18n/*.json`.
- `strict` TS, `strictTemplates`, `noPropertyAccessFromIndexSignature`, `noUnusedLocals`.
  **No `any`.**
- **Node 20+ required** to build/serve (CLI is Angular 21). Use `nvm use 22.22.3`.

## Non-negotiable conventions

- **Selector prefix `app-`** (`app-header`, `[appMenubar]`).
- **File/class names omit the type suffix**: class `BooksShell` in `books-shell.ts`, service
  `BookService` in `services/book.ts` — never `*.component.ts` / `FooComponent`.
- **Path aliases** `@core/*`, `@shared/*`, `@features/*` — not deep relative imports.
- **Private members `_`-prefixed**; inject with `inject()`; explicit accessibility + return types.
- **Every user-facing string goes through Transloco** (`| transloco` pipe, `[attr.aria-label]`
  for a11y labels). No new hardcoded UI text.
- **Accessibility is first-class** (WCAG 2.1 AA): real semantic elements, ARIA roles/labels,
  focus save/restore around dialogs, `LiveAnnouncer` for async status.

## Layout

`src/app/core/` (app-wide services, stores, components, directives), `src/app/shared/`
(cross-feature interfaces), `src/app/features/<feature>/` (self-contained slices). Routes in
`app.routes.ts` lazy-load every feature via `loadComponent`.

## Commands

- `npm start` — dev server at `http://localhost:4200/`.
- `npm run build` — production build to `dist/`.
- `npm test` — Vitest. Single file: `npx ng test --include <path>.spec.ts`.
- No ESLint. Formatting is Prettier (`printWidth: 100`, single quotes) via `package.json`.

## When you touch…

- **a store / async data** → read reference.md §"SignalStore" and §"Async". Reuse
  `withRequestStatus()`, `withModal()`, `withLastFocusedElement()`. Use `rxMethod` + `tapResponse`.
- **i18n / a string / a language** → read reference.md §"i18n". Add keys to *both* `en.json`
  and `it.json`.
- **a11y / dialogs / focus** → read reference.md §"Accessibility".
