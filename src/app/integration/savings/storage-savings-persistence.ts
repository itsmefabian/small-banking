import { inject, Injectable } from '@angular/core';
import { KeyValueStorage } from '../../core/storage/key-value-storage';
import { environment } from '../../../environments/environment';
import { isSavingsGoal, SavingsGoal, SavingsPersistence } from '../../features/savings/public-api';

/** Adapter: stores savings goals in the host's key/value storage. */
@Injectable()
export class StorageSavingsPersistence extends SavingsPersistence {
  private readonly storage = inject(KeyValueStorage);

  loadGoals(): SavingsGoal[] {
    const stored = this.storage.read(environment.savingsGoalsKey);
    return Array.isArray(stored) ? stored.filter(isSavingsGoal) : [];
  }

  saveGoals(goals: readonly SavingsGoal[]): void {
    this.storage.write(environment.savingsGoalsKey, goals);
  }
}
