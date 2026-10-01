import { computed, effect, inject, Service, signal } from '@angular/core';
import { Clock } from '../../../core/time/clock';
import { roundCurrency } from '../../../shared/utils/money';
import {
  budgetStatus,
  budgetUsage,
  calculateAvailable,
  isOverBudget,
  sumByType,
  transactionsOn,
} from '../domain/budget';
import { Transaction, TransactionDraft } from '../domain/transaction';
import { TransactionsRepository } from '../data/transactions-repository';

/** RF01.1 / RF01.2: signal-based state for the daily budget. */
@Service()
export class TransactionsService {
  private readonly repository = inject(TransactionsRepository);
  private readonly clock = inject(Clock);

  private readonly transactionsSignal = signal(this.repository.loadTransactions());
  private readonly dailyLimitSignal = signal(this.repository.loadDailyLimit());

  readonly transactions = this.transactionsSignal.asReadonly();
  readonly dailyLimit = this.dailyLimitSignal.asReadonly();

  readonly todayTransactions = computed(() =>
    transactionsOn(this.transactionsSignal(), this.clock.today()),
  );
  readonly todayExpenses = computed(() => sumByType(this.todayTransactions(), 'expense'));
  readonly todayIncome = computed(() => sumByType(this.todayTransactions(), 'income'));
  readonly availableToday = computed(() =>
    calculateAvailable(this.dailyLimitSignal(), this.todayIncome(), this.todayExpenses()),
  );
  readonly isOverBudget = computed(() => isOverBudget(this.availableToday()));
  /** Today's spendable total: the limit plus anything earned today. */
  readonly todayBudget = computed(() => this.dailyLimitSignal() + this.todayIncome());
  readonly usagePercent = computed(() =>
    Math.round(
      budgetUsage(this.dailyLimitSignal(), this.todayIncome(), this.todayExpenses()) * 100,
    ),
  );
  readonly budgetStatus = computed(() =>
    budgetStatus(this.dailyLimitSignal(), this.todayIncome(), this.todayExpenses()),
  );

  constructor() {
    effect(() => this.repository.saveTransactions(this.transactionsSignal()));
    effect(() => this.repository.saveDailyLimit(this.dailyLimitSignal()));
  }

  add(draft: TransactionDraft): Transaction | null {
    const amount = roundCurrency(draft.amount);
    if (!Number.isFinite(amount) || amount <= 0) return null;

    const transaction: Transaction = {
      id: crypto.randomUUID(),
      amount,
      description: draft.description.trim(),
      type: draft.type,
      date: this.clock.now().toISOString(),
    };

    this.transactionsSignal.update((list) => [transaction, ...list]);
    return transaction;
  }

  remove(id: string): void {
    this.transactionsSignal.update((list) => list.filter((tx) => tx.id !== id));
  }

  /** Puts back a removed transaction (undo). */
  restore(transaction: Transaction): void {
    this.transactionsSignal.update((list) =>
      list.some((tx) => tx.id === transaction.id)
        ? list
        : [...list, transaction].sort((a, b) => b.date.localeCompare(a.date)),
    );
  }

  setDailyLimit(limit: number): void {
    if (Number.isFinite(limit) && limit >= 0) {
      this.dailyLimitSignal.set(roundCurrency(limit));
    }
  }
}
