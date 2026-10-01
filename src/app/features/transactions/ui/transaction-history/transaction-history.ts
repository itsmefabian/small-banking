import { CurrencyPipe, DatePipe, NgTemplateOutlet } from '@angular/common';
import { Component, computed, input, linkedSignal, output, signal } from '@angular/core';
import { fromLocalDateKey, shiftDateKey } from '../../../../shared/utils/date';
import { paginate } from '../../../../shared/utils/pagination';
import { DayGroup, groupByDay } from '../../domain/budget';
import { Transaction, TransactionType } from '../../domain/transaction';

type HistoryFilter = 'all' | TransactionType;

const FILTERS: readonly { value: HistoryFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'expense', label: 'Expenses' },
  { value: 'income', label: 'Income' },
];

export const PAGE_SIZE = 5;

/** RF02.3: grouped by day and paginated; cards on mobile, table on desktop. */
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
  /** Requested page; goes back to 1 whenever the filter changes. */
  protected readonly page = linkedSignal({ source: this.filter, computation: () => 1 });

  private readonly visible = computed(() => {
    const filter = this.filter();
    const list =
      filter === 'all'
        ? this.transactions()
        : this.transactions().filter((tx) => tx.type === filter);
    return [...list].sort((a, b) => b.date.localeCompare(a.date));
  });

  /** Clamped, so deleting the last item of the last page falls back to the previous one. */
  protected readonly pagination = computed(() => paginate(this.visible(), this.page(), PAGE_SIZE));

  /** Day groups for the current page. Day totals still cover the whole day, not just this page. */
  protected readonly groups = computed(() => {
    const onPage = new Set(this.pagination().items.map((tx) => tx.id));
    return groupByDay(this.visible())
      .map((group) => ({
        ...group,
        transactions: group.transactions.filter((tx) => onPage.has(tx.id)),
      }))
      .filter((group) => group.transactions.length > 0);
  });

  protected readonly yesterday = computed(() => shiftDateKey(this.today(), -1));

  protected previous(): void {
    this.page.set(this.pagination().page - 1);
  }

  protected next(): void {
    this.page.set(this.pagination().page + 1);
  }

  protected label(tx: Transaction): string {
    return tx.description || (tx.type === 'expense' ? 'Expense' : 'Income');
  }

  protected dayDate(group: DayGroup): Date {
    return fromLocalDateKey(group.key);
  }
}
