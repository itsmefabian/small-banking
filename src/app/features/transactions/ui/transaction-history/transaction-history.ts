import { CurrencyPipe, DatePipe, NgTemplateOutlet } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';
import { fromLocalDateKey, shiftDateKey } from '../../../../shared/utils/date';
import { DayGroup, groupByDay } from '../../domain/budget';
import { Transaction, TransactionType } from '../../domain/transaction';

type HistoryFilter = 'all' | TransactionType;

const FILTERS: readonly { value: HistoryFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'expense', label: 'Expenses' },
  { value: 'income', label: 'Income' },
];

/** RF02.3: grouped by day; cards on mobile, table on desktop. */
@Component({
  selector: 'app-transaction-history',
  imports: [CurrencyPipe, DatePipe, NgTemplateOutlet],
  templateUrl: './transaction-history.html',
})
export class TransactionHistory {
  readonly transactions = input.required<readonly Transaction[]>();
  /** Today's local date key, used to label "Today" / "Yesterday". */
  readonly today = input.required<string>();
  readonly remove = output<Transaction>();

  protected readonly filters = FILTERS;
  protected readonly filter = signal<HistoryFilter>('all');

  protected readonly groups = computed(() => {
    const filter = this.filter();
    const visible =
      filter === 'all'
        ? this.transactions()
        : this.transactions().filter((tx) => tx.type === filter);
    return groupByDay(visible);
  });

  protected readonly yesterday = computed(() => shiftDateKey(this.today(), -1));

  protected label(tx: Transaction): string {
    return tx.description || (tx.type === 'expense' ? 'Expense' : 'Income');
  }

  protected dayDate(group: DayGroup): Date {
    return fromLocalDateKey(group.key);
  }
}
