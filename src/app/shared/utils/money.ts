import { DEFAULT_CURRENCY_CODE, inject, LOCALE_ID } from '@angular/core';

/** Rounds to cents to avoid floating point drift (0.1 + 0.2). */
export function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Narrow symbol (e.g. `$`) of the app currency in the app locale. Call in an injection context. */
export function injectCurrencySymbol(): string {
  const currency = inject(DEFAULT_CURRENCY_CODE);
  const parts = new Intl.NumberFormat(inject(LOCALE_ID), {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
  }).formatToParts(0);
  return parts.find((part) => part.type === 'currency')?.value ?? currency;
}
