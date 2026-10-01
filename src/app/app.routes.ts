import { Routes } from '@angular/router';
import { Shell } from './layout/shell/shell';

export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/transactions/transactions.routes').then((m) => m.TRANSACTIONS_ROUTES),
      },
      {
        path: 'savings',
        loadChildren: () =>
          import('./integration/savings/savings.routes').then((m) => m.SAVINGS_ROUTES),
      },
      { path: '**', redirectTo: 'dashboard' },
    ],
  },
];
