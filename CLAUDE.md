You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## Project: Small Banking

A mobile-first PWA for daily budgeting and micro-savings. See `README.md` for features and the full folder map.

### Commands

- `npm start`: dev server (the service worker is disabled in dev)
- `npm test -- --watch=false`: run unit tests once (Vitest)
- `npm run build`: production build, including the service worker
- `npx prettier --write "src/app/**/*.{ts,html}"`: format (100 cols, single quotes)

### Layering rules

- Dependencies point inward: `pages` → `application` → `domain`. `data` implements persistence for `application`.
- `domain/` is pure TypeScript: no Angular, no I/O, no `new Date()` for "today" (use `Clock` from `core/time`).
- `ui/` components are presentational: `input()`/`output()` only, never inject feature services. Only `pages/` containers inject services.
- Never use `localStorage` directly. Depend on `KeyValueStorage` (`core/storage`) and validate whatever you read back.
- `features/savings/` must import nothing outside itself except `@angular/*`. The host may only import from `features/savings/public-api.ts`. Connect it to the rest of the app through adapters in `integration/savings/` (the `SavingsWallet` and `SavingsPersistence` ports). It is being prepared for extraction into a separate library.
- Mutations that users can trigger by mistake (add/delete) should offer undo: use `Toaster` in the host app, or the page's own notice inside `savings`.

### UI conventions

- UI text is in English. Locale and currency come from `environment.ts` (`LOCALE_ID`, `DEFAULT_CURRENCY_CODE`). Format money with `CurrencyPipe`; get the currency symbol with `injectCurrencySymbol()` (not the deprecated `getCurrencySymbol`).
- Use Tailwind with the `brand-*` color tokens (not raw `indigo-*`) and the shared utilities from `src/styles.css`: `card`, `field`, `btn`, `btn-primary`, `btn-soft`, `btn-icon`, `chip`, `segmented`, `segment`.
- Modals use `Sheet` (`shared/ui/sheet`, native `<dialog>`), opened with `[(open)]`.
- Mobile layout: a floating bottom nav is fixed at the bottom; page actions (FAB, toasts) must sit above it and respect `env(safe-area-inset-bottom)`.
- Don't convey state by color alone: pair it with text (e.g. the over-budget alert). Body text must be at least `slate-600` on white.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Do NOT set `changeDetection: ChangeDetectionStrategy.OnPush` explicitly. `OnPush` is the default in Angular v22+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `model()` for two-way bound properties with `[(prop)]` syntax instead of pairing `input()` with `output()`
- Use `computed()` for derived state
- Use `linkedSignal()` for state derived from multiple reactive sources that must stay synchronized
- Prefer inline templates for small components
- Prefer Signal Forms (`@angular/forms/signals`) for new forms. They are stable in Angular v22+ and provide signal-based state, type-safe field access, and schema-based validation
- When not using Signal Forms, prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- Do NOT import `CommonModule`, import only the directives and pipes the template uses, such as `AsyncPipe` or `DatePipe`
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Prefer the `@Service` decorator over `@Injectable({providedIn: 'root'})` for new singleton services (Angular v22+)
- Use the `inject()` function instead of constructor injection
