export interface Page<T> {
  items: T[];
  /** 1-based page actually shown, clamped to the available range. */
  page: number;
  totalPages: number;
  totalItems: number;
  /** 1-based index of the first and last item shown (0 when empty). */
  from: number;
  to: number;
}

/** Slices `items` into the requested page. Out-of-range pages clamp to the nearest valid one. */
export function paginate<T>(items: readonly T[], page: number, pageSize: number): Page<T> {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const current = Math.min(Math.max(1, Math.floor(page)), totalPages);
  const start = (current - 1) * pageSize;
  const pageItems = items.slice(start, start + pageSize);

  return {
    items: pageItems,
    page: current,
    totalPages,
    totalItems,
    from: pageItems.length ? start + 1 : 0,
    to: start + pageItems.length,
  };
}
