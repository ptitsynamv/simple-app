# Simple App

[![Angular](https://img.shields.io/badge/Angular-21-DD0031?logo=angular&logoColor=white)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![NgRx Signals](https://img.shields.io/badge/%40ngrx%2Fsignals-21-BA2BD2?logo=ngrx&logoColor=white)](https://ngrx.io/guide/signals)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Transloco](https://img.shields.io/badge/i18n-Transloco-4A90E2)](https://jsverse.gitbook.io/transloco)
[![Vitest](https://img.shields.io/badge/tested_with-Vitest-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev)
[![Node](https://img.shields.io/badge/node-%5E20.19%20%7C%7C%20%5E22.12%20%7C%7C%20%3E%3D24-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![WCAG 2.1 AA](https://img.shields.io/badge/a11y-WCAG_2.1_AA-005A9C)](https://www.w3.org/TR/WCAG21/)
[![License: none](https://img.shields.io/badge/license-none-lightgrey)](#license)
<!-- Build status: enable once a GitHub Actions workflow exists at .github/workflows/ci.yml
[![Build](https://img.shields.io/github/actions/workflow/status/ptitsynamv/simple-app/ci.yml?branch=main&logo=github)](https://github.com/ptitsynamv/simple-app/actions)
-->

A small book-library app built with modern Angular. It is a reference playground for
**standalone, zoneless Angular 21**, state management with the **`@ngrx/signals` SignalStore**,
runtime i18n with **Transloco**, and **WCAG 2.1 AA** accessibility patterns.

The app has no backend. Data comes from in-memory mock services that simulate network
latency, so you can clone it and run it without any other setup.

## Features

- **Books library:** browse, search (debounced), sort, add and delete books, and open a
  detail/reading view at `/books-shell/:id`.
- **SignalStore counter demo:** a small store provided by its component, at `/counter`.
- **Mock authentication:** log in and out with a simulated user profile.
- **SignalStore state architecture:** global stores (`CoreStore`, `BookStore`) built from
  reusable `signalStoreFeature`s for request status, modals and focus restoration. The stores
  use `withComputed`, `withLinkedState`, events (`eventGroup` / `withReducer` /
  `withEventHandlers`) and `rxMethod` with `tapResponse`.
- **Zoneless change detection:** no `zone.js`; rendering is driven by signals.
- **Internationalisation:** English and Italian, with translation files loaded at runtime. The
  chosen language is remembered between visits.
- **Accessibility:**
  - Skip-to-content link.
  - Arrow-key roving focus in the menubar.
  - Focus saved and restored around CDK dialogs.
  - On submit, focus moves to the first invalid form control and the error is announced.
  - Screen-reader announcements when you log in or out.
  - A `<title>` for each route.
  - High-visibility focus outlines.
- **Lazy-loaded routes:** each feature page loads on demand with `loadComponent`.
- **Tailwind CSS v4:** utility-first styling through PostCSS.

## Tech stack

| Area          | Choice                                                          |
| ------------- | --------------------------------------------------------------- |
| Framework     | Angular 21 (standalone components, zoneless)                    |
| Language      | TypeScript 5.9 (`strict`, `strictTemplates`)                    |
| State         | `@ngrx/signals` SignalStore, `@ngrx/operators`, RxJS 7.8        |
| UI primitives | Angular CDK (dialogs, a11y)                                     |
| Styling       | Tailwind CSS 4 via `@tailwindcss/postcss`, SCSS                 |
| i18n          | `@jsverse/transloco` (`en`, `it`)                               |
| Testing       | Vitest + jsdom via `@angular/build:unit-test`                   |
| Formatting    | Prettier (configured in `package.json`)                         |

## Prerequisites

- **Node.js** `^20.19.0`, `^22.12.0` or `>=24.0.0`. The Angular 21 CLI requires one of these
  ranges and won't run on Node 18 or earlier.
- **npm** 8 or newer. The repository pins `npm@11.6.2` through the `packageManager` field.
- **Git**

### Using an older Node version on your machine? Use NVM

If your system Node is older (for example Node 16 or 18 for legacy projects), you can install
a supported version next to it without replacing it:

```bash
# macOS / Linux: https://github.com/nvm-sh/nvm
nvm install 22
nvm use 22

# Windows: https://github.com/coreybutler/nvm-windows
nvm install 22.12.0
nvm use 22.12.0
```

Check the active versions:

```bash
node -v   # should print v20.19+, v22.12+ or v24+
npm -v
```

Optionally, enable Corepack so that the pinned npm version is used:

```bash
corepack enable
```

## Getting started

```bash
# 1. Clone
git clone https://github.com/ptitsynamv/simple-app.git
cd simple-app

# 2. Install dependencies (use `npm ci` for a clean, lockfile-exact install)
npm ci

# 3. Start the dev server
npm start
```

Open <http://localhost:4200/>. The app redirects to `/books-shell`, and it reloads
automatically when you save a source file.

## Available scripts

| Command          | Description                                                   |
| ---------------- | ------------------------------------------------------------- |
| `npm start`      | Start the dev server (`ng serve`) on port 4200                |
| `npm run build`  | Create a production build in `dist/`                          |
| `npm run watch`  | Rebuild on every change using the development configuration   |
| `npm test`       | Run unit tests with Vitest                                    |

Run a single spec file:

```bash
npx ng test --include src/app/features/books/services/book.spec.ts
```

There is no lint script or end-to-end test framework yet. Formatting follows the Prettier
settings in `package.json` (100-column lines, single quotes, the Angular parser for HTML).

## Project structure

```text
simple-app/
├── public/
│   └── i18n/                  # Translation files (en.json, it.json), served at /i18n/*
├── src/
│   ├── main.ts                # Standalone bootstrap
│   ├── styles.scss            # Tailwind import + global focus styles
│   └── app/
│       ├── app.ts / app.html  # Root shell: skip link, header, <router-outlet>, footer
│       ├── app.config.ts      # Providers: router, HttpClient, Transloco, title strategy
│       ├── app.routes.ts      # Lazy-loaded routes
│       ├── core/              # App-wide singletons
│       │   ├── components/    # Header (menubar, language switcher), footer
│       │   ├── directives/    # appMenubar (roving focus), appFocusInvalid
│       │   ├── services/      # Auth, language, storage, focus management, title strategy, i18n loader
│       │   └── stores/        # CoreStore + reusable store features (request status, modal, a11y)
│       ├── shared/
│       │   └── interfaces/    # Types shared across features
│       └── features/
│           ├── books/         # BookStore, mock BookService, table/details/modals/reader components
│           └── counter/       # CounterStore demo page
├── angular.json               # Angular CLI workspace configuration
├── .postcssrc.json            # Tailwind PostCSS plugin
└── tsconfig*.json             # Strict TS config + path aliases
```

**Path aliases** (in `tsconfig.json`): `@core/*`, `@shared/*` and `@features/*` map to the
matching folders under `src/app/`.

**Naming convention:** file and class names leave out the Angular type suffix. For example,
the `BooksShell` component lives in `books-shell.ts`, not `books-shell.component.ts`.

### Routes

| Path               | Page                          |
| ------------------ | ----------------------------- |
| `/`                | Redirects to `/books-shell`   |
| `/books-shell`     | Books library                 |
| `/books-shell/:id` | Read a single book            |
| `/counter`         | SignalStore counter demo      |

## Adding a translation

1. Add the key to **both** `public/i18n/en.json` and `public/i18n/it.json`.
2. Use it in a template with the Transloco pipe: `{{ 'nav.books' | transloco }}`.
3. To add a new language, add its code to `availableLangs` in `src/app/app.config.ts` and
   create a matching `public/i18n/<code>.json` file.

## License

This repository doesn't include a license file yet, so all rights are reserved by default.
Add a `LICENSE` file and update the badge above if you want others to reuse the code.
