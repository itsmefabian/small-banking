import { CurrencyPipe } from '@angular/common';
import { Component, input, linkedSignal, output } from '@angular/core';
import { form, FormField, FormRoot, min, required } from '@angular/forms/signals';
import { injectCurrencySymbol } from '../../../../shared/utils/money';

const PRESETS = [20, 30, 50, 100];

@Component({
  selector: 'app-daily-limit-form',
  imports: [CurrencyPipe, FormField, FormRoot],
  template: `
    <form [formRoot]="limitForm" class="grid gap-5">
      <div class="grid gap-2">
        <label for="daily-limit" class="text-sm font-medium text-slate-700">
          The most you want to spend per day
        </label>
        <div class="field flex items-center gap-1 py-1">
          <span class="text-3xl font-semibold text-slate-500" aria-hidden="true">
            {{ currencySymbol }}
          </span>
          <input
            id="daily-limit"
            type="number"
            inputmode="decimal"
            step="0.01"
            placeholder="0"
            autofocus
            [formField]="limitForm.limit"
            [attr.aria-invalid]="limitForm.limit().touched() && limitForm.limit().invalid()"
            aria-describedby="daily-limit-errors"
            class="w-full min-w-0 bg-transparent py-2 text-3xl font-semibold tracking-tight tabular-nums text-slate-900 outline-none placeholder:text-slate-400"
          />
        </div>
        <div id="daily-limit-errors" aria-live="polite">
          @if (limitForm.limit().touched()) {
            @for (error of limitForm.limit().errors(); track error.kind) {
              <p class="text-sm font-medium text-red-700">{{ error.message }}</p>
            }
          }
        </div>
      </div>

      <fieldset class="flex flex-wrap gap-2">
        <legend class="sr-only">Suggested amounts</legend>
        @for (preset of presets; track preset) {
          <button
            type="button"
            class="chip"
            (click)="limitForm.limit().value.set(preset)"
            [attr.aria-pressed]="limitForm.limit().value() === preset"
          >
            {{ preset | currency: undefined : 'symbol' : '1.0-0' }}
          </button>
        }
      </fieldset>

      <button type="submit" class="btn btn-primary">Save limit</button>
    </form>
  `,
})
export class DailyLimitForm {
  readonly dailyLimit = input.required<number>();
  readonly limitChange = output<number>();

  protected readonly presets = PRESETS;
  protected readonly currencySymbol = injectCurrencySymbol();

  // Re-syncs with the stored limit whenever the parent value changes.
  private readonly model = linkedSignal<{ limit: number | null }>(() => ({
    limit: this.dailyLimit() || null,
  }));

  protected readonly limitForm = form(
    this.model,
    (path) => {
      required(path.limit, { message: 'Enter a limit.' });
      min(path.limit, 0, { message: "The limit can't be negative." });
    },
    {
      submission: {
        action: async (field) => {
          this.limitChange.emit(field.limit().value() ?? 0);
          return undefined;
        },
      },
    },
  );
}
