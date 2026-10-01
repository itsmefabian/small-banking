import { DestroyRef, DOCUMENT, inject, Service, signal } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

/** Tracks when the service worker has downloaded a new version of the app. */
@Service()
export class AppUpdate {
  // Optional: the service worker is only provided (and enabled) in production builds.
  private readonly swUpdate = inject(SwUpdate, { optional: true });
  private readonly document = inject(DOCUMENT);
  private readonly updateReadySignal = signal(false);

  readonly updateReady = this.updateReadySignal.asReadonly();

  constructor() {
    if (!this.swUpdate?.isEnabled) return;

    const subscription = this.swUpdate.versionUpdates.subscribe((event) => {
      if (event.type === 'VERSION_READY') this.updateReadySignal.set(true);
    });
    inject(DestroyRef).onDestroy(() => subscription.unsubscribe());
  }

  async activate(): Promise<void> {
    await this.swUpdate?.activateUpdate();
    this.document.location.reload();
  }
}
