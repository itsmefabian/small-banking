import {
  budgetStatus,
  calculateAvailable,
  groupByDay,
  isOverBudget,
  sumByType,
  transactionsOn,
} from './budget';
import { Transaction } from './transaction';

const tx = (overrides: Partial<Transaction>): Transaction => ({
  id: crypto.randomUUID(),
  amount: 10,
  description: '',
  type: 'expense',
  date: new Date(2026, 9, 1, 12).toISOString(),
  ...overrides,
});

describe('budget rules', () => {
  it('keeps only transactions from the given local day', () => {
    const today = tx({});
    const yesterday = tx({ date: new Date(2026, 8, 30, 23, 59).toISOString() });
    expect(transactionsOn([today, yesterday], '2026-10-01')).toEqual([today]);
  });

  it('sums by type without floating point drift', () => {
    const list = [tx({ amount: 0.1 }), tx({ amount: 0.2 }), tx({ amount: 5, type: 'income' })];
    expect(sumByType(list, 'expense')).toBe(0.3);
    expect(sumByType(list, 'income')).toBe(5);
  });

  it('flags over budget only below zero', () => {
    expect(calculateAvailable(20, 5, 30)).toBe(-5);
    expect(isOverBudget(-0.01)).toBe(true);
    expect(isOverBudget(0)).toBe(false);
  });

  it('derives the budget status from limit, income and expenses', () => {
    expect(budgetStatus(0, 0, 0)).toBe('unset');
    expect(budgetStatus(100, 0, 50)).toBe('ok');
    expect(budgetStatus(100, 0, 80)).toBe('warning');
    expect(budgetStatus(100, 20, 90)).toBe('ok');
    expect(budgetStatus(100, 0, 101)).toBe('over');
    expect(budgetStatus(0, 0, 5)).toBe('over');
  });

  it('groups by local day, newest first', () => {
    const morning = tx({ date: new Date(2026, 9, 1, 8).toISOString(), amount: 3 });
    const noon = tx({ amount: 7 });
    const income = tx({ type: 'income', amount: 50 });
    const yesterday = tx({ date: new Date(2026, 8, 30, 20).toISOString() });

    const groups = groupByDay([morning, yesterday, noon, income]);

    expect(groups.map((g) => g.key)).toEqual(['2026-10-01', '2026-09-30']);
    expect(groups[0].transactions[groups[0].transactions.length - 1]).toBe(morning);
    expect(groups[0].expenses).toBe(10);
    expect(groups[0].income).toBe(50);
  });
});
