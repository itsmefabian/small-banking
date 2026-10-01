import { Routes } from '@angular/router';
import { provideSavings, SavingsPage } from '../../features/savings/public-api';
import { StorageSavingsPersistence } from './storage-savings-persistence';
import { TransactionsSavingsWallet } from './transactions-savings-wallet';

export const SAVINGS_ROUTES: Routes = [
  {
    path: '',
    title: 'Savings · Small Banking',
    providers: [
      provideSavings({ wallet: TransactionsSavingsWallet, persistence: StorageSavingsPersistence }),
    ],
    component: SavingsPage,
  },
];
