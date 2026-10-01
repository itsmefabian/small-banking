/** Formats a date as `YYYY-MM-DD` in the user's local time zone. */
export function toLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Parses a `YYYY-MM-DD` key as local midnight. */
export function fromLocalDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function shiftDateKey(key: string, days: number): string {
  const date = fromLocalDateKey(key);
  date.setDate(date.getDate() + days);
  return toLocalDateKey(date);
}

export function msUntilNextMidnight(now: Date): number {
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime() - now.getTime();
}
