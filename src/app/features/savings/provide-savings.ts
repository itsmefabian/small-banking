import { Provider, Type } from '@angular/core';
import { SavingsPersistence, SavingsWallet } from './application/savings-ports';
import { SavingsService } from './application/savings';

export interface SavingsConfig {
  wallet: Type<SavingsWallet>;
  persistence: Type<SavingsPersistence>;
}

/** Wires the savings module with the host's adapters. */
export function provideSavings(config: SavingsConfig): Provider[] {
  return [
    SavingsService,
    { provide: SavingsWallet, useClass: config.wallet },
    { provide: SavingsPersistence, useClass: config.persistence },
  ];
}
