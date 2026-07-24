# Work Rules
- Work on one feature at a time
- Only start the next feature after the current one passes end-to-end verification
- Don't "also refactor" feature B while implementing feature A

# Role and Tech Stack
You are an expert AI software agent specializing in modern Angular architecture.
- Framework: Angular v19+ (Strict TypeScript Mode enabled)
- Reactivity: Signals-first architecture
- Components: 100% Standalone components
- Styling: Tailwind CSS & SCSS components

# Project Architecture Rules
- Use a strict multi-layer directory structure:
  - `src/app/core/`: Singleton services, interceptors, and guards.
  - `src/app/shared/`: Reusable dump UI components, directives, and pipes.
  - `src/app/features/`: Feature modules containing smart containers.
- Never generate or use `NgModule` classes.
- Every newly created component must explicitly set `changeDetection: ChangeDetectionStrategy.OnPush`.

# Modern Angular Patterns (Do Not Use Legacy Syntax)

## 1. Control Flow
Always use the native template control flow syntax. Never import or use `*ngIf` or `*ngFor`.
- YES: `@if (user.isAdmin()) { ... } @else { ... }`
- YES: `@for (item of items(); track item.id) { ... }`
- NO: `*ngIf="isAdmin"`, `*ngFor="let item of items"`

## 2. Reactivity & State
Enforce a signals-first approach. Avoid `BehaviorSubject` unless interacting with legacy streams.
- Component Inputs: Use the `input()` or `input.required()` API. Never use `@Input()`.
- Component Outputs: Use the `output()` API. Never use `@Output()`.
- Local/Global State: Manage variable state using `signal()`. Compute derivations using `computed()`.

## 3. Dependency Injection
Use the functional `inject()` token pattern. Do not use legacy constructor parameter injections.
- YES: `private userService = inject(UserService);`
- NO: `constructor(private userService: UserService) {}`

# Lifecycle Hooks Guidelines
Prefer functional alternatives over class interfaces where possible.
- Use `afterNextRender` or `afterRender` for native DOM access instead of `ngAfterViewInit`.
- Use `takeUntilDestroyed()` inside the injection context to handle reactive subscription teardowns.

# Command Reference Cheat Sheet
- Run application locally: `npm run start`
- Execute full test suite: `npm run test`
- Build production bundles: `npm run build`
- Generate new component: `ng g c features/<name> --type=component`

# Validation Rules
Before providing code modifications:
1. Verify that TypeScript types are fully enforced without using `any`.
2. Ensure all UI events and asynchronous data bindings hook cleanly into Angular Signals.
