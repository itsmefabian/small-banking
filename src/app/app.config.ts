import {
  ApplicationConfig,
  DEFAULT_CURRENCY_CODE,
  isDevMode,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { provideLocalStorage } from './core/storage/local-storage';

// en-US locale data ships with Angular. For any other locale, call
// registerLocaleData(...) with the matching '@angular/common/locales/<id>' import.

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    { provide: LOCALE_ID, useValue: environment.locale },
    { provide: DEFAULT_CURRENCY_CODE, useValue: environment.currency },
    // Swap for an IndexedDB adapter here without touching any feature (RF04.2).
    provideLocalStorage(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
