/**
 * Port for key/value persistence. Features depend on this abstraction, never on a concrete
 * browser API, so the backing store (LocalStorage today, IndexedDB later) can be swapped
 * from `app.config.ts` without touching feature code.
 */
export abstract class KeyValueStorage {
  /** Returns the parsed value stored under `key`, or `undefined` when missing or unreadable. */
  abstract read(key: string): unknown;
  abstract write(key: string, value: unknown): void;
}
