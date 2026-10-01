import { CurrencyPipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { progressPercent, remainingFor, roundCents, SavingsGoal } from '../../domain/savings-goal';

/** RF03.3: a goal with its progress bar and contribution actions. */
@Component({
  selector: 'app-savings-goal-card',
  imports: [CurrencyPipe],
  host: { class: 'block h-full' },
  template: `
    <article
      [attr.aria-labelledby]="'goal-' + goal().id"
      class="card flex h-full flex-col gap-5 p-5"
      [class.ring-emerald-300]="completed()"
    >
      <header class="flex items-start gap-3">
        <span
          class="grid size-11 shrink-0 place-items-center rounded-2xl text-lg font-semibold"
          [class]="completed() ? 'bg-emerald-50 text-emerald-800' : 'bg-brand-50 text-brand-800'"
          aria-hidden="true"
        >
          {{ initial() }}
        </span>
        <div class="min-w-0 flex-1">
          <h3
            [id]="'goal-' + goal().id"
            class="truncate font-semibold tracking-tight text-slate-900"
          >
            {{ goal().name }}
          </h3>
          <p class="text-sm text-slate-600">Target {{ goal().target | currency }}</p>
        </div>
        <button
          type="button"
          class="btn-icon -mr-2 -mt-1 hover:text-red-700"
          (click)="remove.emit()"
          [attr.aria-label]="'Delete goal ' + goal().name"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            class="size-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          >
            <path d="M6 7h12M9 7V5h6v2m-7 3v7m4-7v7m4-7v7M7 7l1 13h8l1-13" />
          </svg>
        </button>
      </header>

      <div>
        <div class="mb-2 flex items-baseline justify-between gap-2">
          <p class="text-3xl font-semibold tracking-tight tabular-nums text-slate-900">
            {{ goal().saved | currency }}
          </p>
          <p
            class="text-sm font-semibold tabular-nums"
            [class]="completed() ? 'text-emerald-800' : 'text-brand-700'"
          >
            {{ percent() }}%
          </p>
        </div>
        <div
          role="progressbar"
          [attr.aria-label]="goal().name + ' progress'"
          aria-valuemin="0"
          aria-valuemax="100"
          [attr.aria-valuenow]="percent()"
          [attr.aria-valuetext]="percent() + '%'"
          class="h-2.5 overflow-hidden rounded-full bg-slate-100"
        >
          <div
            class="h-full rounded-full bg-linear-to-r transition-[width] duration-700 ease-out"
            [class]="
              completed() ? 'from-emerald-500 to-emerald-700' : 'from-brand-500 to-violet-600'
            "
            [style.width.%]="percent()"
          ></div>
        </div>
        <p class="mt-2 text-sm text-slate-700">
          @if (completed()) {
            <span class="font-semibold text-emerald-800">Goal reached! 🎉</span>
          } @else {
            {{ remaining() | currency }} to go
          }
        </p>
      </div>

      @if (!completed()) {
        <div class="mt-auto grid grid-cols-2 gap-2">
          <button
            type="button"
            class="btn btn-primary px-3 py-2.5 text-sm"
            (click)="contribute.emit(1)"
            [disabled]="available() < 1"
          >
            Add {{ 1 | currency: undefined : 'symbol' : '1.0-0' }}
          </button>
          <button
            type="button"
            class="btn btn-soft px-3 py-2.5 text-sm"
            (click)="transferLeftover.emit()"
            [disabled]="leftover() <= 0"
          >
            Leftover
            @if (leftover() > 0) {
              <span class="font-medium">{{ leftover() | currency }}</span>
            }
            <span class="sr-only">from today</span>
          </button>
        </div>
      }
    </article>
  `,
})
export class SavingsGoalCard {
  readonly goal = input.required<SavingsGoal>();
  readonly available = input.required<number>();

  readonly contribute = output<number>();
  readonly transferLeftover = output<void>();
  readonly remove = output<void>();

  protected readonly percent = computed(() => progressPercent(this.goal()));
  protected readonly remaining = computed(() => remainingFor(this.goal()));
  protected readonly completed = computed(() => this.remaining() === 0);
  protected readonly initial = computed(() => this.goal().name.charAt(0).toUpperCase());
  /** What "Transfer leftover" would move right now. */
  protected readonly leftover = computed(() =>
    roundCents(Math.max(Math.min(this.available(), this.remaining()), 0)),
  );
}
