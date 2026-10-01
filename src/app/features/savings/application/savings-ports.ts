import { Signal } from '@angular/core';
import { SavingsGoal } from '../domain/savings-goal';

/**
 * Contracts the host app must implement. The savings module never imports the host's
 * TransactionsService or storage directly; that keeps it extractable as a library (Phase 4).
 */

/** Where the money for a contribution comes from (the host's daily budget). */
export abstract class SavingsWallet {
  abstract readonly available: Signal<number>;
  /** Registers the contribution as spent money on the host side. */
  abstract withdraw(amount: number, concept: string): void;
}

export abstract class SavingsPersistence {
  abstract loadGoals(): SavingsGoal[];
  abstract saveGoals(goals: readonly SavingsGoal[]): void;
}
