import type { NativeFederationResult } from '@angular-architects/native-federation';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// Die Routen brauchen loadRemoteModule aus initFederation, deshalb ist die Konfiguration eine Funktion.
// HttpClient stellt der Host bereit; geladene Remotes nutzen ihn mit (inklusive Interceptors).
export const appConfig = (nf: NativeFederationResult): ApplicationConfig => ({
  providers: [provideBrowserGlobalErrorListeners(), provideRouter(routes(nf)), provideHttpClient(withFetch())],
});
