import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding, withPreloading } from '@angular/router';
import { authInterceptor } from './eventhub/auth/auth.interceptor';
import { DelayedPreloading } from './eventhub/delayed-preloading';
import { EVENTHUB_ROUTES } from './eventhub/eventhub.routes';

// Root-Konfiguration des EventHub-Labs nach Lab 9.2 (workspaces/eventhub-lab/src/app/app.config.ts).
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(EVENTHUB_ROUTES, withComponentInputBinding(), withPreloading(DelayedPreloading)),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
  ],
};
