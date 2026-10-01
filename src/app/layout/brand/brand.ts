import { Component } from '@angular/core';

@Component({
  selector: 'app-brand',
  host: { class: 'flex items-center gap-2.5' },
  template: `
    <span
      class="grid size-9 place-items-center rounded-xl bg-linear-to-br from-brand-500 to-violet-700 text-white shadow-md shadow-brand-600/30"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        class="size-5"
        fill="none"
        stroke="currentColor"
        stroke-width="2.25"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M3 10 12 4l9 6M5 10v8m4-8v8m6-8v8m4-8v8M3 20h18" />
      </svg>
    </span>
    <span class="text-base font-semibold tracking-tight text-slate-900">Small Banking</span>
  `,
})
export class Brand {}
