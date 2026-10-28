import { HttpClient } from '@angular/common/http';
import { EnvironmentProviders, Injectable, inject, makeEnvironmentProviders } from '@angular/core';
import { Observable, tap } from 'rxjs';

/** Inhalt von public/config.json */
export interface EventHubConfig {
  apiUrl: string;
  featureFlags: { comments: boolean };
}

/** Hält die beim Start geladene Konfiguration. */
@Injectable()
export class EventHubConfigService {
  private readonly http = inject(HttpClient);
  private loaded?: EventHubConfig;
  loadedAt?: Date;

  load(url: string): Observable<EventHubConfig> {
    // tap: Nebenwirkung (merken), der Wert läuft unverändert weiter
    return this.http.get<EventHubConfig>(url).pipe(
      tap((config) => {
        this.loaded = config;
        this.loadedAt = new Date();
      }),
    );
  }

  get config(): EventHubConfig {
    if (!this.loaded) throw new Error('EventHub-Konfiguration ist noch nicht geladen');
    return this.loaded;
  }
}

/** Eigener Provider: registriert den Service und lädt die Konfiguration, bevor die App startet. */
export function provideEventHubConfig(url = '/config.json'): EnvironmentProviders {
  return makeEnvironmentProviders([
    // TODO 5: EventHubConfigService als Provider eintragen
    // TODO 6: provideAppInitializer(...) ergänzen, das load(url) zurückgibt
  ]);
}
