import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Clock } from '../../../../core/time/clock';
import { fromLocalDateKey } from '../../../../shared/utils/date';
import { Sheet } from '../../../../shared/ui/sheet/sheet';
import { Toaster } from '../../../../shared/ui/toast/toaster';
import { TransactionsService } from '../../application/transactions';
import { Transaction, TransactionDraft } from '../../domain/transaction';
import { DailyBalance } from '../../ui/daily-balance/daily-balance';
import { DailyLimitForm } from '../../ui/daily-limit-form/daily-limit-form';
import { TransactionForm } from '../../ui/transaction-form/transaction-form';
import { TransactionHistory } from '../../ui/transaction-history/transaction-history';

/** Container: the only piece of the feature UI that talks to the service. */
@Component({
  selector: 'app-dashboard',
  imports: [DatePipe, DailyBalance, DailyLimitForm, Sheet, TransactionForm, TransactionHistory],
  providers: [CurrencyPipe],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  protected readonly transactions = inject(TransactionsService);
  protected readonly clock = inject(Clock);
  private readonly toaster = inject(Toaster);
  private readonly currency = inject(CurrencyPipe);

  protected readonly todayDate = computed(() => fromLocalDateKey(this.clock.today()));
  protected readonly addOpen = signal(false);
  protected readonly limitOpen = signal(false);

  protected add(draft: TransactionDraft): void {
    const tx = this.transactions.add(draft);
    if (!tx) return;

    this.addOpen.set(false);
    const kind = tx.type === 'expense' ? 'Expense' : 'Income';
    this.toaster.show(`${kind} of ${this.currency.transform(tx.amount)} added`, {
      label: 'Undo',
      run: () => this.transactions.remove(tx.id),
    });
  }

  protected remove(tx: Transaction): void {
    this.transactions.remove(tx.id);
    this.toaster.show('Transaction deleted', {
      label: 'Undo',
      run: () => this.transactions.restore(tx),
    });
  }

  protected saveLimit(limit: number): void {
    this.transactions.setDailyLimit(limit);
    this.limitOpen.set(false);
    this.toaster.show(`Daily limit set to ${this.currency.transform(limit)}`);
  }
}
