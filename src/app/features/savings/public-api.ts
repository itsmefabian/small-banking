/*
 * Public surface of the savings module. The host app imports ONLY from this file, so in
 * Phase 4 it becomes `projects/savings-lib/src/public-api.ts` and imports switch to the package.
 */
export * from './domain/savings-goal';
export * from './application/savings-ports';
export * from './application/savings';
export * from './provide-savings';
export * from './pages/savings-page/savings-page';
