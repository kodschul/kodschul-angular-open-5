import { HttpClient } from '@angular/common/http';
import {
  EnvironmentProviders,
  Injectable,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
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

/**
 * Eigener Provider im Stil von provideRouter()/provideHttpClient():
 * registriert den Service und lädt die Konfiguration, bevor die App startet.
 */
export function provideEventHubConfig(url = '/config.json'): EnvironmentProviders {
  return makeEnvironmentProviders([
    EventHubConfigService,
    // Angular wartet beim Start, bis das Observable abgeschlossen ist (Fehler = Start bricht ab)
    provideAppInitializer(() => inject(EventHubConfigService).load(url)),
  ]);
}
