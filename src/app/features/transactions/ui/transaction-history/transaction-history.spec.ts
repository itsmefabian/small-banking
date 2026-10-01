import { TestBed } from '@angular/core/testing';
import { Transaction } from '../../domain/transaction';
import { TransactionHistory } from './transaction-history';

const makeTransactions = (count: number, type: Transaction['type'] = 'expense'): Transaction[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `${type}-${i}`,
    amount: i + 1,
    description: `${type} ${i}`,
    type,
    date: new Date(2026, 9, 1, 12, 59 - i).toISOString(),
  }));

describe('TransactionHistory pagination', () => {
  async function render(transactions: Transaction[]) {
    const fixture = TestBed.createComponent(TransactionHistory);
    fixture.componentRef.setInput('transactions', transactions);
    fixture.componentRef.setInput('today', '2026-10-01');
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;
    return {
      fixture,
      host,
      rows: () => host.querySelectorAll('ul li').length,
      button: (label: string) =>
        host.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`),
      clickFilter: (text: string) =>
        [...host.querySelectorAll<HTMLButtonElement>('fieldset button')]
          .find((b) => b.textContent?.trim() === text)
          ?.click(),
    };
  }

  it('shows at most 5 transactions per page', async () => {
    const { rows, host } = await render(makeTransactions(12));
    expect(rows()).toBe(5);
    expect(host.querySelector('nav')?.textContent).toContain('1–5');
  });

  it('moves between pages and disables the edges', async () => {
    const { fixture, rows, button } = await render(makeTransactions(12));
    expect(button('Previous page')?.disabled).toBe(true);

    button('Next page')?.click();
    button('Next page')?.click();
    await fixture.whenStable();

    expect(rows()).toBe(2);
    expect(button('Next page')?.disabled).toBe(true);
  });

  it('hides the controls when everything fits on one page', async () => {
    const { host } = await render(makeTransactions(5));
    expect(host.querySelector('nav')).toBeNull();
  });

  it('returns to the first page when the filter changes', async () => {
    const { fixture, button, clickFilter, host } = await render([
      ...makeTransactions(8),
      ...makeTransactions(3, 'income'),
    ]);
    button('Next page')?.click();
    await fixture.whenStable();

    clickFilter('Expenses');
    await fixture.whenStable();

    expect(host.querySelector('nav')?.textContent).toContain('1–5');
  });

  it('falls back to the last valid page after deletions', async () => {
    const { fixture, button, rows } = await render(makeTransactions(6));
    button('Next page')?.click();
    await fixture.whenStable();

    fixture.componentRef.setInput('transactions', makeTransactions(5));
    await fixture.whenStable();

    expect(rows()).toBe(5);
  });
});
