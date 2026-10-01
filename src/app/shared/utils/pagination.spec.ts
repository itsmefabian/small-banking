import { paginate } from './pagination';

describe('paginate', () => {
  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  it('returns the requested page and its range', () => {
    expect(paginate(items, 2, 5)).toEqual({
      items: [6, 7, 8, 9, 10],
      page: 2,
      totalPages: 3,
      totalItems: 12,
      from: 6,
      to: 10,
    });
  });

  it('returns a partial last page', () => {
    expect(paginate(items, 3, 5).items).toEqual([11, 12]);
  });

  it('clamps out-of-range pages', () => {
    expect(paginate(items, 99, 5).page).toBe(3);
    expect(paginate(items, 0, 5).page).toBe(1);
  });

  it('handles an empty list as a single empty page', () => {
    expect(paginate([], 1, 5)).toEqual({
      items: [],
      page: 1,
      totalPages: 1,
      totalItems: 0,
      from: 0,
      to: 0,
    });
  });
});
