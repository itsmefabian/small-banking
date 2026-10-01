import { DOCUMENT, inject, Injectable, Provider } from '@angular/core';
import { KeyValueStorage } from './key-value-storage';

@Injectable()
export class LocalStorageKeyValueStorage extends KeyValueStorage {
  private readonly storage = inject(DOCUMENT).defaultView?.localStorage;

  read(key: string): unknown {
    try {
      const raw = this.storage?.getItem(key);
      return raw == null ? undefined : JSON.parse(raw);
    } catch {
      return undefined;
    }
  }

  write(key: string, value: unknown): void {
    try {
      this.storage?.setItem(key, JSON.stringify(value));
    } catch {
      // Quota exceeded or storage blocked (private mode): keep working in memory.
    }
  }
}

export function provideLocalStorage(): Provider {
  return { provide: KeyValueStorage, useClass: LocalStorageKeyValueStorage };
}
