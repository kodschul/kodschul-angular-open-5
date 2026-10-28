import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withComponentInputBinding, withPreloading } from '@angular/router';
import { DelayedPreloading } from './eventhub/delayed-preloading';
import { EVENTHUB_ROUTES } from './eventhub/eventhub.routes';

// Root-Konfiguration des EventHub-Labs nach Lab 8.2 (workspaces/eventhub-lab/src/app/app.config.ts).
// withPreloading wirkt nur hier, beim Root-Router – nicht in Routen-Providern.
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(EVENTHUB_ROUTES, withComponentInputBinding(), withPreloading(DelayedPreloading)),
    provideHttpClient(withFetch()),
  ],
};
