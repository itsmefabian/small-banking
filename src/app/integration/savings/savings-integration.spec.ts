import { TestBed } from '@angular/core/testing';
import { KeyValueStorage } from '../../core/storage/key-value-storage';
import { TransactionsService } from '../../features/transactions/application/transactions';
import { provideSavings, SavingsService } from '../../features/savings/public-api';
import { StorageSavingsPersistence } from './storage-savings-persistence';
import { TransactionsSavingsWallet } from './transactions-savings-wallet';

class MemoryStorage extends KeyValueStorage {
  private readonly data = new Map<string, unknown>();
  read(key: string): unknown {
    return this.data.get(key);
  }
  write(key: string, value: unknown): void {
    this.data.set(key, value);
  }
}

describe('savings ↔ transactions integration', () => {
  let transactions: TransactionsService;
  let savings: SavingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: KeyValueStorage, useClass: MemoryStorage },
        provideSavings({
          wallet: TransactionsSavingsWallet,
          persistence: StorageSavingsPersistence,
        }),
      ],
    });
    transactions = TestBed.inject(TransactionsService);
    savings = TestBed.inject(SavingsService);
    transactions.setDailyLimit(10);
  });

  it('records a contribution as an expense of today', () => {
    savings.createGoal('Bici', 100);
    const goal = savings.goals()[0];

    expect(savings.contribute(goal.id, 1)).toEqual({ ok: true, amount: 1 });
    expect(transactions.availableToday()).toBe(9);
    expect(savings.goals()[0].saved).toBe(1);
  });

  it('transfers the leftover, capped to what the goal still needs', () => {
    savings.createGoal('Café', 4);
    const goal = savings.goals()[0];

    expect(savings.transferLeftover(goal.id)).toEqual({ ok: true, amount: 4 });
    expect(transactions.availableToday()).toBe(6);
  });

  it('rejects contributions larger than the available budget', () => {
    savings.createGoal('Viaje', 500);
    transactions.add({ amount: 10, description: 'Comida', type: 'expense' });

    expect(savings.contribute(savings.goals()[0].id, 1)).toEqual({
      ok: false,
      reason: 'insufficient-funds',
    });
    expect(transactions.isOverBudget()).toBe(false);
  });
});
