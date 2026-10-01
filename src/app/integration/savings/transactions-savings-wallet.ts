import { inject, Injectable } from '@angular/core';
import { TransactionsService } from '../../features/transactions/application/transactions';
import { SavingsWallet } from '../../features/savings/public-api';

/** Adapter: a savings contribution is recorded as an expense of today's budget (RF03.2). */
@Injectable()
export class TransactionsSavingsWallet extends SavingsWallet {
  private readonly transactions = inject(TransactionsService);

  readonly available = this.transactions.availableToday;

  withdraw(amount: number, concept: string): void {
    this.transactions.add({ amount, description: concept, type: 'expense' });
  }
}
