import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideEventHubConfig } from './eventhub-config';

/** ApplicationConfig der Mini-App – Gegenstück zu src/app/app.config.ts der Kurs-App. */
export function createMiniAppConfig(configUrl = '/config.json'): ApplicationConfig {
  return {
    providers: [
      // HttpClient ist in Angular 22 auch ohne Eintrag injizierbar (providedIn: root, Fetch);
      // provideHttpClient macht die Wahl sichtbar und ist der Ort für withInterceptors (Lab 9.2)
      provideHttpClient(withFetch()),
      provideEventHubConfig(configUrl),
    ],
  };
}
