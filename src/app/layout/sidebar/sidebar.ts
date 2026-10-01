import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Brand } from '../brand/brand';
import { NAV_ITEMS } from '../navigation/nav-items';

/** RNF03.2: desktop navigation. */
@Component({
  selector: 'app-sidebar',
  imports: [Brand, RouterLink, RouterLinkActive],
  template: `
    <div class="sticky top-0 flex h-dvh flex-col p-4">
      <div class="card flex flex-1 flex-col p-4">
        <app-brand class="mb-8 px-2 pt-1" />
        <nav aria-label="Main" class="grid gap-1">
          @for (item of items; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive
              #rla="routerLinkActive"
              ariaCurrentWhenActive="page"
              class="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-brand-600"
              [class]="
                rla.isActive
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              "
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
                <path [attr.d]="item.icon" />
              </svg>
              {{ item.label }}
            </a>
          }
        </nav>

        <div class="mt-auto rounded-2xl bg-slate-50 p-3 text-xs text-slate-700">
          <p class="flex items-center gap-2 font-semibold text-slate-900">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              class="size-4 text-emerald-700"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            >
              <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" />
            </svg>
            Private by design
          </p>
          <p class="mt-1">Your data stays on this device and works offline.</p>
        </div>
      </div>
    </div>
  `,
})
export class Sidebar {
  protected readonly items = NAV_ITEMS;
}
