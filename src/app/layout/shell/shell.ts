import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastOutlet } from '../../shared/ui/toast/toast-outlet';
import { AppStatus } from '../app-status/app-status';
import { BottomNav } from '../bottom-nav/bottom-nav';
import { Brand } from '../brand/brand';
import { Sidebar } from '../sidebar/sidebar';

/** RNF03.1: mobile-first shell. Top bar + floating nav below `md`, sidebar from `md` up. */
@Component({
  selector: 'app-shell',
  imports: [AppStatus, BottomNav, Brand, RouterOutlet, Sidebar, ToastOutlet],
  host: { class: 'block min-h-dvh' },
  template: `
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-40 focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:text-brand-800 focus:shadow-lg"
    >
      Skip to content
    </a>

    <header
      class="sticky top-0 z-10 bg-[#f6f7fb]/80 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-xl md:hidden"
    >
      <app-brand />
    </header>

    <div class="md:grid md:min-h-dvh md:grid-cols-[17rem_1fr]">
      <app-sidebar class="hidden md:block" />

      <main
        id="main-content"
        tabindex="-1"
        class="mx-auto w-full max-w-6xl px-4 pb-32 pt-3 focus:outline-none md:px-8 md:pb-12 md:pt-8"
      >
        <app-status />
        <router-outlet />
      </main>
    </div>

    <app-bottom-nav class="md:hidden" />
    <app-toast-outlet />
  `,
})
export class Shell {}
