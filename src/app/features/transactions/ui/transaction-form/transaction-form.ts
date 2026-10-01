import { CurrencyPipe } from '@angular/common';
import { Component, computed, output, signal } from '@angular/core';
import { form, FormField, FormRoot, min, required } from '@angular/forms/signals';
import { injectCurrencySymbol } from '../../../../shared/utils/money';
import { TransactionDraft, TransactionType } from '../../domain/transaction';

interface TransactionFormModel {
  type: TransactionType;
  amount: number | null;
  description: string;
}

const EMPTY_FORM: TransactionFormModel = { type: 'expense', amount: null, description: '' };
const QUICK_AMOUNTS = [5, 10, 20, 50];

/** RF02.1: presentational form. Emits a draft; it does not know about the service. */
@Component({
  selector: 'app-transaction-form',
  imports: [CurrencyPipe, FormField, FormRoot],
  templateUrl: './transaction-form.html',
})
export class TransactionForm {
  readonly submitted = output<TransactionDraft>();

  protected readonly quickAmounts = QUICK_AMOUNTS;
  protected readonly currencySymbol = injectCurrencySymbol();

  private readonly model = signal<TransactionFormModel>({ ...EMPTY_FORM });

  protected readonly transactionForm = form(
    this.model,
    (path) => {
      required(path.amount, { message: 'Enter an amount.' });
      min(path.amount, 0.01, { message: 'The amount must be greater than 0.' });
    },
    {
      submission: {
        action: async (field) => {
          const { type, amount, description } = field().value();
          this.submitted.emit({ type, amount: amount ?? 0, description });
          // Keep the chosen type: people usually log several expenses in a row.
          this.model.set({ ...EMPTY_FORM, type });
          field().reset();
          return undefined;
        },
      },
    },
  );

  protected readonly isExpense = computed(() => this.transactionForm.type().value() === 'expense');

  protected setType(type: TransactionType): void {
    this.transactionForm.type().value.set(type);
  }
}
