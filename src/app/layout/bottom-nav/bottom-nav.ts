import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NAV_ITEMS } from '../navigation/nav-items';

/** RNF03.2: floating mobile navigation. */
@Component({
  selector: 'app-bottom-nav',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav
      aria-label="Main"
      class="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-10 rounded-3xl bg-white/85 p-1.5 shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/5 backdrop-blur-xl"
    >
      <ul class="grid auto-cols-fr grid-flow-col gap-1">
        @for (item of items; track item.path) {
          <li>
            <a
              [routerLink]="item.path"
              routerLinkActive
              #rla="routerLinkActive"
              ariaCurrentWhenActive="page"
              class="flex min-h-12 items-center justify-center gap-2 rounded-2xl text-sm font-semibold transition focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-600"
              [class]="rla.isActive ? 'bg-brand-600 text-white' : 'text-slate-700'"
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
          </li>
        }
      </ul>
    </nav>
  `,
})
export class BottomNav {
  protected readonly items = NAV_ITEMS;
}
