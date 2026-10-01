import { toLocalDateKey } from '../../../shared/utils/date';
import { roundCurrency } from '../../../shared/utils/money';
import { Transaction, TransactionType } from './transaction';

// Pure budget rules: no Angular, no I/O. Easy to unit test and reuse.

/** Share of the day's budget at which the UI starts warning. */
export const WARNING_THRESHOLD = 0.8;

export type BudgetStatus = 'unset' | 'ok' | 'warning' | 'over';

export interface DayGroup {
  key: string;
  transactions: Transaction[];
  expenses: number;
  income: number;
}

export function transactionsOn(
  transactions: readonly Transaction[],
  dayKey: string,
): Transaction[] {
  return transactions.filter((tx) => toLocalDateKey(new Date(tx.date)) === dayKey);
}

export function sumByType(transactions: readonly Transaction[], type: TransactionType): number {
  return roundCurrency(
    transactions.filter((tx) => tx.type === type).reduce((sum, tx) => sum + tx.amount, 0),
  );
}

export function calculateAvailable(dailyLimit: number, income: number, expenses: number): number {
  return roundCurrency(dailyLimit + income - expenses);
}

/** RF01.3: the day is over budget once the available amount drops below zero. */
export function isOverBudget(available: number): boolean {
  return available < 0;
}

/** Fraction (0..n) of today's budget (limit + income) already spent. */
export function budgetUsage(dailyLimit: number, income: number, expenses: number): number {
  const budget = dailyLimit + income;
  if (budget <= 0) return expenses > 0 ? 1 : 0;
  return expenses / budget;
}

export function budgetStatus(dailyLimit: number, income: number, expenses: number): BudgetStatus {
  if (dailyLimit <= 0 && income === 0 && expenses === 0) return 'unset';
  if (isOverBudget(calculateAvailable(dailyLimit, income, expenses))) return 'over';
  return budgetUsage(dailyLimit, income, expenses) >= WARNING_THRESHOLD ? 'warning' : 'ok';
}

/** Groups by local day, newest day first and newest transaction first within each day. */
export function groupByDay(transactions: readonly Transaction[]): DayGroup[] {
  const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date));
  const groups = new Map<string, Transaction[]>();
  for (const tx of sorted) {
    const key = toLocalDateKey(new Date(tx.date));
    groups.set(key, [...(groups.get(key) ?? []), tx]);
  }
  return [...groups].map(([key, items]) => ({
    key,
    transactions: items,
    expenses: sumByType(items, 'expense'),
    income: sumByType(items, 'income'),
  }));
}
