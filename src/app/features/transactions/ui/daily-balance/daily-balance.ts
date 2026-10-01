import { CurrencyPipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { BudgetStatus } from '../../domain/budget';

/** RF02.2 + RF01.3: today's figures; the card turns red and alerts when over budget. */
@Component({
  selector: 'app-daily-balance',
  imports: [CurrencyPipe],
  templateUrl: './daily-balance.html',
})
export class DailyBalance {
  readonly available = input.required<number>();
  readonly dailyLimit = input.required<number>();
  readonly budget = input.required<number>();
  readonly expenses = input.required<number>();
  readonly income = input.required<number>();
  readonly usagePercent = input.required<number>();
  readonly status = input.required<BudgetStatus>();

  readonly editLimit = output<void>();

  protected readonly barWidth = computed(() => Math.min(this.usagePercent(), 100));
}
