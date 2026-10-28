import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding, withPreloading } from '@angular/router';
import { provideAuth } from 'angular-auth-oidc-client';
import { authInterceptor } from './eventhub/auth/auth.interceptor';
import { DelayedPreloading } from './eventhub/delayed-preloading';
import { EVENTHUB_ROUTES } from './eventhub/eventhub.routes';
import { oidcConfig } from './oidc.config';

// Root-Konfiguration des EventHub-Labs nach Lab 9.3 (workspaces/eventhub-lab/src/app/app.config.ts).
// provideAuth muss hier stehen: Die Dienste der Bibliothek sind providedIn: 'root'.
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(EVENTHUB_ROUTES, withComponentInputBinding(), withPreloading(DelayedPreloading)),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideAuth({ config: oidcConfig }),
  ],
};
