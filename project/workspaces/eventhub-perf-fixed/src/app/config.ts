import { HttpClient } from '@angular/common/http';
import { EnvironmentProviders, Injectable, inject, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';
import { Observable, tap } from 'rxjs';

/** Inhalt von public/config.json; im Container schreibt das Startskript die Datei (Lab 13.3). */
export interface EventHubConfig {
  apiUrl: string;
}

/** Hält die beim Start geladene Konfiguration (wie in Lab 2.2). */
@Injectable()
export class EventHubConfigService {
  private readonly http = inject(HttpClient);
  private loaded?: EventHubConfig;

  load(url: string): Observable<EventHubConfig> {
    return this.http.get<EventHubConfig>(url).pipe(tap((config) => (this.loaded = config)));
  }

  get config(): EventHubConfig {
    if (!this.loaded) throw new Error('EventHub-Konfiguration ist noch nicht geladen');
    return this.loaded;
  }
}

/** Lädt config.json, bevor die erste Komponente erzeugt wird (Lab 2.2). */
export function provideEventHubConfig(url = '/config.json'): EnvironmentProviders {
  return makeEnvironmentProviders([
    EventHubConfigService,
    provideAppInitializer(() => inject(EventHubConfigService).load(url)),
  ]);
}
