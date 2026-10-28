import type { NativeFederationResult } from '@angular-architects/native-federation';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

export function bootstrap(nf: NativeFederationResult) {
  return bootstrapApplication(App, appConfig(nf)).catch((err) => console.error(err));
}
