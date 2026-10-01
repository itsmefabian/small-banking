import { Component, inject } from '@angular/core';
import { Toaster } from './toaster';

@Component({
  selector: 'app-toast-outlet',
  template: `
    <div
      role="status"
      class="pointer-events-none fixed inset-x-3 bottom-[calc(10rem+env(safe-area-inset-bottom))] z-30 flex justify-center md:inset-x-auto md:bottom-6 md:right-6"
    >
      @if (toaster.current(); as toast) {
        <div
          (mouseenter)="toaster.hold()"
          (mouseleave)="toaster.release()"
          (focusin)="toaster.hold()"
          (focusout)="toaster.release()"
          class="pointer-events-auto flex w-full max-w-sm items-center gap-2 rounded-2xl bg-slate-900/95 py-2 pl-4 pr-2 text-sm text-white shadow-2xl shadow-slate-900/30 ring-1 ring-white/10 backdrop-blur"
        >
          <span class="size-2 shrink-0 rounded-full bg-emerald-400" aria-hidden="true"></span>
          <p class="flex-1 font-medium">{{ toast.message }}</p>
          @if (toast.action; as action) {
            <button
              type="button"
              (click)="toaster.runAction()"
              class="rounded-xl px-3 py-2 font-semibold text-brand-200 transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-brand-300"
            >
              {{ action.label }}
            </button>
          }
          <button
            type="button"
            (click)="toaster.dismiss()"
            aria-label="Dismiss"
            class="grid size-9 place-items-center rounded-xl text-slate-300 transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-brand-300"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              class="size-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
      }
    </div>
  `,
})
export class ToastOutlet {
  protected readonly toaster = inject(Toaster);
}
