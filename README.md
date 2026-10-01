# Small Banking

A mobile-first PWA for **daily budgeting and micro-savings**. Set how much you want to spend per
day, log expenses and income, and see what's left update instantly. Move small amounts, or the
day's leftover, into savings goals. Everything runs on the device and works offline.

Built with Angular 22 (standalone components, signals, Signal Forms, zoneless) and Tailwind CSS 4.

## Features

- **Daily budget**: set a daily limit and see what you have left today. The balance card warns at
  80% usage and turns red, with an alert, once you go over.
- **Quick entry**: a bottom sheet (dialog on desktop) with an Expense/Income toggle, preset
  amounts and an optional description. Every add or delete can be undone from a toast.
- **History**: transactions grouped by day (Today, Yesterday, …) with All/Expenses/Income
  filters, paginated 5 per page. Shown as a list on mobile and a table on desktop.
- **Micro-savings**: create goals, add $1 or transfer the day's leftover. Each deposit is recorded
  as an expense of today's budget.
- **PWA**: installable and works offline. Shows an offline notice and an "Update" prompt when a new
  version is ready.
- **Accessible**: native `<dialog>` focus handling, labelled controls, live regions for feedback
  and WCAG AA contrast. Animations are turned off when the system asks for reduced motion.

## Getting started

Requires Node.js and npm.

```bash
npm install
npm start          # dev server at http://localhost:4200
npm test           # unit tests (Vitest)
npm run build      # production build in dist/small-banking/browser
```

### Testing the PWA

The service worker is only enabled in production builds, so `ng serve` won't register it.

```bash
npm run build
npx http-server dist/small-banking/browser -p 8080 -c-1
```

Open `http://localhost:8080`, install the app from the browser's address bar, then turn on
**Offline** in DevTools → Application → Service Workers and reload. The app and your data should
still be there.

## Architecture

The code is split into layers, and dependencies only point inward: UI → application → domain.
Infrastructure sits behind small abstract classes ("ports") so it can be swapped out.

```
src/app/
├─ core/                     App-wide infrastructure
│  ├─ storage/               KeyValueStorage port + LocalStorage adapter
│  ├─ time/                  Clock: single source of "today", rolls over at midnight
│  └─ pwa/                   Connectivity (online/offline) and AppUpdate (new version)
├─ shared/
│  ├─ ui/                    Sheet (dialog/bottom sheet), Toaster + ToastOutlet
│  └─ utils/                 Pure date and money helpers
├─ layout/                   Shell, Sidebar (desktop), BottomNav (mobile), Brand, AppStatus
├─ features/
│  ├─ transactions/
│  │  ├─ domain/             Transaction model, pure budget rules
│  │  ├─ data/               TransactionsRepository (persistence)
│  │  ├─ application/        TransactionsService (signals + computed state)
│  │  ├─ ui/                 Presentational components (inputs/outputs only)
│  │  └─ pages/              Dashboard (container, the only part that talks to the service)
│  └─ savings/               Self-contained module, imports nothing outside @angular/*
│     ├─ domain/ application/ ui/ pages/
│     ├─ provide-savings.ts  Wires the module with host-supplied adapters
│     └─ public-api.ts       The only entry point the host may import
└─ integration/savings/      Host adapters: savings wallet → TransactionsService,
                             savings persistence → KeyValueStorage
```

### State

`TransactionsService` keeps two writable signals, `transactionsSignal` and `dailyLimitSignal`,
and derives everything else with `computed()`:

| Signal             | Meaning                                         |
| ------------------ | ----------------------------------------------- |
| `todayExpenses`    | Sum of today's expenses                         |
| `todayIncome`      | Sum of today's income                           |
| `availableToday`   | `dailyLimit + todayIncome − todayExpenses`      |
| `isOverBudget`     | `availableToday < 0`                            |
| `budgetStatus`     | `unset` · `ok` · `warning` (≥ 80%) · `over`     |

The business rules live as pure functions in
[`features/transactions/domain/budget.ts`](src/app/features/transactions/domain/budget.ts). "Today"
is based on the local date (not UTC), and comes from `Clock` so it rolls over at midnight
without a reload.

### Persistence

Features depend on the abstract `KeyValueStorage`, never on `localStorage` directly. To switch to
IndexedDB, write an adapter and replace `provideLocalStorage()` in
[`app.config.ts`](src/app/app.config.ts). Everything read from storage is validated before use.

### Savings module and micro-frontend readiness

`features/savings` depends only on two contracts it defines itself:

- `SavingsWallet`: where money comes from (`available` signal, `withdraw()`).
- `SavingsPersistence`: load and save goals.

The host app provides both in
[`integration/savings/savings.routes.ts`](src/app/integration/savings/savings.routes.ts) via
`provideSavings({ wallet, persistence })`. To extract the module into its own library (Phase 4),
move the folder into the library as-is, export `public-api.ts`, and change the host imports to the
package name. The module uses the global style utilities (`card`, `btn`, …), so the library needs
the host's Tailwind setup or its own copy of those utilities.

## Styling

Tailwind CSS 4. The design tokens and shared component utilities are in
[`src/styles.css`](src/styles.css):

- `brand-*` color scale (currently mapped to indigo). Change it there to re-theme the app.
- Utilities: `card`, `field`, `btn`, `btn-primary`, `btn-soft`, `btn-icon`, `chip`, `segmented`,
  `segment`.
- Font: Inter, loaded from Google Fonts and cached by the service worker. Falls back to the system
  font.

## Configuration

[`src/environments/environment.ts`](src/environments/environment.ts) (and `.development.ts`):

| Key                                                    | Purpose                                 |
| ------------------------------------------------------ | --------------------------------------- |
| `transactionKey`, `dailyLimitKey`, `savingsGoalsKey`   | Storage keys                            |
| `locale`                                               | `LOCALE_ID` for dates and numbers       |
| `currency`                                             | Default currency for `CurrencyPipe`     |

For a locale other than `en-US`, also call `registerLocaleData()` in `app.config.ts`.

## Roadmap

- [x] Phase 1: core budget logic with signals
- [x] Phase 2: responsive layout, PWA, local persistence
- [x] Phase 3: micro-savings module inside the app
- [ ] Phase 4: extract savings into an Angular library (separate repo, `ng-packagr`, consumed via
      `npm link` or a package registry)
- [ ] IndexedDB storage adapter
- [ ] Dark mode
