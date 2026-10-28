import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { EVENTHUB_ROUTES } from './eventhub/eventhub.routes';

// Root-Konfiguration des EventHub-Labs. Anders als in der Kurs-App gehört sie hier ganz der Übung.
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(EVENTHUB_ROUTES, withComponentInputBinding()),
    provideHttpClient(withFetch()),
  ],
};
