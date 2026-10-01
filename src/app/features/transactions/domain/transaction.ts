export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: TransactionType;
  /** ISO-8601 timestamp. */
  date: string;
}

/** What the UI provides when registering a movement; id and date are assigned by the service. */
export type TransactionDraft = Pick<Transaction, 'amount' | 'description' | 'type'>;

export function isTransaction(value: unknown): value is Transaction {
  if (typeof value !== 'object' || value === null) return false;
  const tx = value as Record<string, unknown>;
  return (
    typeof tx['id'] === 'string' &&
    typeof tx['amount'] === 'number' &&
    typeof tx['description'] === 'string' &&
    (tx['type'] === 'income' || tx['type'] === 'expense') &&
    typeof tx['date'] === 'string'
  );
}
