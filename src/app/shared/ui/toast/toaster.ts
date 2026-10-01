import { Service, signal } from '@angular/core';

export interface ToastAction {
  label: string;
  run: () => void;
}

export interface Toast {
  id: number;
  message: string;
  action?: ToastAction;
}

const DURATION_MS = 4000;
const DURATION_WITH_ACTION_MS = 8000;

/** One toast at a time. Timers pause while the toast is hovered or focused (WCAG 2.2.1). */
@Service()
export class Toaster {
  private readonly toastSignal = signal<Toast | null>(null);
  private timer: ReturnType<typeof setTimeout> | undefined;
  private nextId = 0;

  readonly current = this.toastSignal.asReadonly();

  show(message: string, action?: ToastAction): void {
    this.toastSignal.set({ id: ++this.nextId, message, action });
    this.release();
  }

  dismiss(): void {
    clearTimeout(this.timer);
    this.toastSignal.set(null);
  }

  runAction(): void {
    this.toastSignal()?.action?.run();
    this.dismiss();
  }

  hold(): void {
    clearTimeout(this.timer);
  }

  release(): void {
    clearTimeout(this.timer);
    const toast = this.toastSignal();
    if (!toast) return;
    this.timer = setTimeout(
      () => this.dismiss(),
      toast.action ? DURATION_WITH_ACTION_MS : DURATION_MS,
    );
  }
}
