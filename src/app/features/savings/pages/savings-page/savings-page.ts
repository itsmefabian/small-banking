import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { SavingsService } from '../../application/savings';
import { ContributionResult, remainingFor, SavingsGoal } from '../../domain/savings-goal';
import { SavingsGoalCard } from '../../ui/savings-goal-card/savings-goal-card';
import { SavingsGoalDraft, SavingsGoalForm } from '../../ui/savings-goal-form/savings-goal-form';

const FAILURE_MESSAGES: Record<Extract<ContributionResult, { ok: false }>['reason'], string> = {
  'invalid-amount': 'There is no valid amount to save.',
  'insufficient-funds': "You don't have enough available today for that.",
  'goal-completed': 'This goal is already complete.',
  'not-found': 'This goal no longer exists.',
};

interface Notice {
  message: string;
  tone: 'success' | 'error';
  undo?: () => void;
}

@Component({
  selector: 'app-savings-page',
  imports: [CurrencyPipe, SavingsGoalCard, SavingsGoalForm],
  providers: [CurrencyPipe],
  templateUrl: './savings-page.html',
})
export class SavingsPage {
  protected readonly savings = inject(SavingsService);
  private readonly currency = inject(CurrencyPipe);

  protected readonly notice = signal<Notice | null>(null);
  protected readonly formOpen = signal(false);
  protected readonly showForm = computed(
    () => this.formOpen() || this.savings.goals().length === 0,
  );
  protected readonly activeGoals = computed(
    () => this.savings.goals().filter((goal) => remainingFor(goal) > 0).length,
  );

  protected createGoal({ name, target }: SavingsGoalDraft): void {
    this.savings.createGoal(name, target);
    this.formOpen.set(false);
    this.notice.set({ message: `Goal "${name.trim()}" created.`, tone: 'success' });
  }

  protected removeGoal(goal: SavingsGoal): void {
    this.savings.removeGoal(goal.id);
    this.notice.set({
      message: `Goal "${goal.name}" deleted.`,
      tone: 'success',
      undo: () => this.savings.restoreGoal(goal),
    });
  }

  protected undo(): void {
    this.notice()?.undo?.();
    this.notice.set(null);
  }

  protected report(result: ContributionResult): void {
    this.notice.set(
      result.ok
        ? {
            message: `You saved ${this.currency.transform(result.amount)}. It was deducted from today's budget.`,
            tone: 'success',
          }
        : { message: FAILURE_MESSAGES[result.reason], tone: 'error' },
    );
  }
}
