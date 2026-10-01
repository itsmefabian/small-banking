import { Component, inject } from '@angular/core';
import { AppUpdate } from '../../core/pwa/app-update';
import { Connectivity } from '../../core/pwa/connectivity';

/** Offline notice and "new version" prompt shown above the page content. */
@Component({
  selector: 'app-status',
  template: `
    <div role="status" class="grid gap-2">
      @if (!connectivity.online()) {
        <p
          class="mb-2 flex items-center gap-2 rounded-2xl bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-900 ring-1 ring-amber-200"
        >
          <span class="size-2 rounded-full bg-amber-500" aria-hidden="true"></span>
          You're offline. Your transactions are saved on this device.
        </p>
      }
      @if (appUpdate.updateReady()) {
        <div
          class="mb-2 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-brand-50 px-4 py-2 text-sm text-brand-900 ring-1 ring-brand-200"
        >
          <p class="font-medium">A new version is available.</p>
          <button type="button" (click)="appUpdate.activate()" class="btn btn-primary px-3 py-1.5">
            Update
          </button>
        </div>
      }
    </div>
  `,
})
export class AppStatus {
  protected readonly connectivity = inject(Connectivity);
  protected readonly appUpdate = inject(AppUpdate);
}
