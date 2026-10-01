import { computed, effect, inject, Service, signal } from '@angular/core';
import { ContributionResult, remainingFor, roundCents, SavingsGoal } from '../domain/savings-goal';
import { SavingsPersistence, SavingsWallet } from './savings-ports';

/** Provided through `provideSavings()`, not at root, because it needs host-supplied ports. */
@Service({ autoProvided: false })
export class SavingsService {
  private readonly wallet = inject(SavingsWallet);
  private readonly persistence = inject(SavingsPersistence);

  private readonly goalsSignal = signal(this.persistence.loadGoals());

  readonly goals = this.goalsSignal.asReadonly();
  readonly available = this.wallet.available;
  readonly totalSaved = computed(() =>
    roundCents(this.goalsSignal().reduce((sum, goal) => sum + goal.saved, 0)),
  );

  constructor() {
    effect(() => this.persistence.saveGoals(this.goalsSignal()));
  }

  createGoal(name: string, target: number): void {
    const trimmed = name.trim();
    if (!trimmed || !Number.isFinite(target) || target <= 0) return;

    const goal: SavingsGoal = {
      id: crypto.randomUUID(),
      name: trimmed,
      target: roundCents(target),
      saved: 0,
      createdAt: new Date().toISOString(),
    };
    this.goalsSignal.update((goals) => [...goals, goal]);
  }

  removeGoal(id: string): void {
    this.goalsSignal.update((goals) => goals.filter((goal) => goal.id !== id));
  }

  /** Puts back a removed goal (undo), keeping creation order. */
  restoreGoal(goal: SavingsGoal): void {
    this.goalsSignal.update((goals) =>
      goals.some((g) => g.id === goal.id)
        ? goals
        : [...goals, goal].sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    );
  }

  /** RF03.2: moves money from today's available budget into a goal. */
  contribute(goalId: string, requested: number): ContributionResult {
    const goal = this.goalsSignal().find((g) => g.id === goalId);
    if (!goal) return { ok: false, reason: 'not-found' };

    const remaining = remainingFor(goal);
    if (remaining === 0) return { ok: false, reason: 'goal-completed' };

    const amount = roundCents(Math.min(requested, remaining));
    if (!Number.isFinite(amount) || amount <= 0) return { ok: false, reason: 'invalid-amount' };
    if (amount > this.available()) return { ok: false, reason: 'insufficient-funds' };

    this.wallet.withdraw(amount, `Savings: ${goal.name}`);
    this.goalsSignal.update((goals) =>
      goals.map((g) => (g.id === goalId ? { ...g, saved: roundCents(g.saved + amount) } : g)),
    );
    return { ok: true, amount };
  }

  /** RF03.2: "Transfer today's leftover". */
  transferLeftover(goalId: string): ContributionResult {
    return this.contribute(goalId, this.available());
  }
}
