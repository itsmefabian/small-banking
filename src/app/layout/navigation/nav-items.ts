export interface NavItem {
  label: string;
  path: string;
  /** SVG path data for a 24x24 outline icon. */
  icon: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  {
    label: 'Budget',
    path: '/dashboard',
    icon: 'M3 10h18M5 6h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Zm2 8h4',
  },
  {
    label: 'Savings',
    path: '/savings',
    icon: 'M12 3v18m4-14H10a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6H7',
  },
];
