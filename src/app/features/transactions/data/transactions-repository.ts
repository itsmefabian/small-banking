import { inject, Service } from '@angular/core';
import { KeyValueStorage } from '../../../core/storage/key-value-storage';
import { environment } from '../../../../environments/environment';
import { isTransaction, Transaction } from '../domain/transaction';

/** Persistence for the transactions feature. Validates whatever comes back from storage. */
@Service()
export class TransactionsRepository {
  private readonly storage = inject(KeyValueStorage);

  loadTransactions(): Transaction[] {
    const stored = this.storage.read(environment.transactionKey);
    return Array.isArray(stored) ? stored.filter(isTransaction) : [];
  }

  saveTransactions(transactions: readonly Transaction[]): void {
    this.storage.write(environment.transactionKey, transactions);
  }

  loadDailyLimit(): number {
    const stored = Number(this.storage.read(environment.dailyLimitKey));
    return Number.isFinite(stored) && stored >= 0 ? stored : 0;
  }

  saveDailyLimit(limit: number): void {
    this.storage.write(environment.dailyLimitKey, limit);
  }
}
