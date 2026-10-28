// Modul 7, Lab 7.3: Besonderheit der Kurs-App.
// Jede Lab-Route hat ihren eigenen Store (provideStore() an der Route statt in app.config.ts),
// damit sich Beispiele und Playground nicht gegenseitig beeinflussen.
// Die Effects-Laufzeit (Actions, EffectSources, EffectsRunner) ist in NgRx als
// providedIn: 'root' registriert und würde dort einen Store suchen, den es im Root nicht gibt.
// Diese Funktion stellt sie deshalb zusätzlich an der Route bereit.
// In einer normalen App mit provideStore() und provideEffects() in app.config.ts entfällt sie.
import { Provider } from '@angular/core';
import { Actions, EffectSources, EffectsRunner } from '@ngrx/effects';

export function provideEffectsRuntimeAtRoute(): Provider[] {
  return [Actions, EffectSources, EffectsRunner];
}
