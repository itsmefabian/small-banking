import { DestroyRef, inject, Service, signal } from '@angular/core';
import { msUntilNextMidnight, toLocalDateKey } from '../../shared/utils/date';

/**
 * Single source of "now" for the app. Exposes `today` as a signal that rolls over at local
 * midnight, so every computed that depends on the current day recalculates on its own.
 */
@Service()
export class Clock {
  private readonly todaySignal = signal(toLocalDateKey(this.now()));

  readonly today = this.todaySignal.asReadonly();

  constructor() {
    let timer: ReturnType<typeof setTimeout>;
    const scheduleRollover = () => {
      timer = setTimeout(() => {
        this.todaySignal.set(toLocalDateKey(this.now()));
        scheduleRollover();
      }, msUntilNextMidnight(this.now()));
    };

    scheduleRollover();
    inject(DestroyRef).onDestroy(() => clearTimeout(timer));
  }

  now(): Date {
    return new Date();
  }
}
