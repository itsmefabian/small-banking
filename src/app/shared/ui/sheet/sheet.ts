import { Component, effect, ElementRef, input, model, viewChild } from '@angular/core';

let nextId = 0;

/**
 * Modal built on native `<dialog>`: focus trap, Escape to close and focus restore come for free.
 * Renders as a bottom sheet on mobile and a centered dialog from `md` up.
 */
@Component({
  selector: 'app-sheet',
  template: `
    <dialog
      #dialog
      [attr.aria-labelledby]="titleId"
      (close)="open.set(false)"
      (click)="closeOnBackdrop($event)"
      class="m-auto w-full max-w-md rounded-3xl bg-white p-0 text-slate-900 shadow-2xl ring-1 ring-slate-900/5 backdrop:bg-slate-900/40 backdrop:backdrop-blur-sm max-md:mb-0 max-md:max-w-none max-md:rounded-b-none"
    >
      <div class="p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:p-6">
        <div
          class="mx-auto -mt-1 mb-4 h-1.5 w-12 rounded-full bg-slate-200 md:hidden"
          aria-hidden="true"
        ></div>
        <header class="mb-5 flex items-center justify-between gap-4">
          <h2 [id]="titleId" class="text-xl font-semibold tracking-tight">{{ heading() }}</h2>
          <button
            type="button"
            (click)="open.set(false)"
            aria-label="Close"
            class="btn-icon bg-slate-100"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              class="size-5"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </header>
        <ng-content />
      </div>
    </dialog>
  `,
})
export class Sheet {
  readonly heading = input.required<string>();
  readonly open = model(false);

  protected readonly titleId = `sheet-title-${nextId++}`;
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    effect(() => {
      const dialog = this.dialog().nativeElement;
      if (this.open() && !dialog.open) dialog.showModal();
      if (!this.open() && dialog.open) dialog.close();
    });
  }

  protected closeOnBackdrop(event: MouseEvent): void {
    // The inner wrapper covers the whole dialog box, so only backdrop clicks hit the dialog itself.
    if (event.target === this.dialog().nativeElement) this.open.set(false);
  }
}
