export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  saved: number;
  /** ISO-8601 timestamp. */
  createdAt: string;
}

export type ContributionResult =
  | { ok: true; amount: number }
  | { ok: false; reason: 'invalid-amount' | 'insufficient-funds' | 'goal-completed' | 'not-found' };

export function isSavingsGoal(value: unknown): value is SavingsGoal {
  if (typeof value !== 'object' || value === null) return false;
  const goal = value as Record<string, unknown>;
  return (
    typeof goal['id'] === 'string' &&
    typeof goal['name'] === 'string' &&
    typeof goal['target'] === 'number' &&
    typeof goal['saved'] === 'number' &&
    typeof goal['createdAt'] === 'string'
  );
}

// Local copy on purpose: this feature must not import from the host app (see public-api.ts).
export function roundCents(value: number): number {
  return Math.round(value * 100) / 100;
}

export function remainingFor(goal: SavingsGoal): number {
  return Math.max(roundCents(goal.target - goal.saved), 0);
}

export function progressPercent(goal: SavingsGoal): number {
  if (goal.target <= 0) return 0;
  return Math.min(Math.round((goal.saved / goal.target) * 100), 100);
}
