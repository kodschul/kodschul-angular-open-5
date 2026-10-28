import { ApplicationConfig } from '@angular/core';

/** ApplicationConfig der Mini-App – Gegenstück zu src/app/app.config.ts der Kurs-App. */
export function createMiniAppConfig(configUrl = '/config.json'): ApplicationConfig {
  return {
    providers: [
      // TODO 3: HttpClient mit fetch bereitstellen (wie in src/app/app.config.ts)
      // TODO 4: provideEventHubConfig(configUrl) eintragen
    ],
  };
}
