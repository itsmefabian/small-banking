import { Component, output, signal } from '@angular/core';
import { form, FormField, FormRoot, min, required } from '@angular/forms/signals';

export interface SavingsGoalDraft {
  name: string;
  target: number;
}

interface GoalFormModel {
  name: string;
  target: number | null;
}

const EMPTY_GOAL: GoalFormModel = { name: '', target: null };

@Component({
  selector: 'app-savings-goal-form',
  imports: [FormField, FormRoot],
  template: `
    <form [formRoot]="goalForm" class="grid gap-4 sm:grid-cols-[1fr_12rem_auto] sm:items-start">
      <div class="grid gap-2">
        <label for="goal-name" class="text-sm font-medium text-slate-700">
          What are you saving for?
        </label>
        <input
          id="goal-name"
          type="text"
          autocomplete="off"
          placeholder="e.g. New bike, trip…"
          class="field"
          [formField]="goalForm.name"
          [attr.aria-invalid]="goalForm.name().touched() && goalForm.name().invalid()"
          aria-describedby="goal-name-errors"
        />
        <div id="goal-name-errors" aria-live="polite">
          @if (goalForm.name().touched()) {
            @for (error of goalForm.name().errors(); track error.kind) {
              <p class="text-sm font-medium text-red-700">{{ error.message }}</p>
            }
          }
        </div>
      </div>

      <div class="grid gap-2">
        <label for="goal-target" class="text-sm font-medium text-slate-700">Target amount</label>
        <input
          id="goal-target"
          type="number"
          inputmode="decimal"
          step="0.01"
          placeholder="0.00"
          class="field tabular-nums"
          [formField]="goalForm.target"
          [attr.aria-invalid]="goalForm.target().touched() && goalForm.target().invalid()"
          aria-describedby="goal-target-errors"
        />
        <div id="goal-target-errors" aria-live="polite">
          @if (goalForm.target().touched()) {
            @for (error of goalForm.target().errors(); track error.kind) {
              <p class="text-sm font-medium text-red-700">{{ error.message }}</p>
            }
          }
        </div>
      </div>

      <button type="submit" class="btn btn-primary sm:mt-7">Create goal</button>
    </form>
  `,
})
export class SavingsGoalForm {
  readonly created = output<SavingsGoalDraft>();

  private readonly model = signal<GoalFormModel>({ ...EMPTY_GOAL });

  protected readonly goalForm = form(
    this.model,
    (path) => {
      required(path.name, { message: 'Give your goal a name.' });
      required(path.target, { message: 'Enter a target amount.' });
      min(path.target, 1, { message: 'The target must be at least 1.' });
    },
    {
      submission: {
        action: async (field) => {
          const { name, target } = field().value();
          this.created.emit({ name, target: target ?? 0 });
          this.model.set({ ...EMPTY_GOAL });
          field().reset();
          return undefined;
        },
      },
    },
  );
}
