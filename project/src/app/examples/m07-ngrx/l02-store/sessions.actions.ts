// Lab 7.2: Actions als Ereignisse („was ist passiert“), gruppiert nach Quelle.
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Session } from '../../../shared/models';

// Ereignisse der Seite: ausgelöst durch die Person vor dem Bildschirm
export const sessionsPageActions = createActionGroup({
  source: 'Sessions Page',
  events: {
    Opened: emptyProps(), // Typ: '[Sessions Page] Opened'
    'Favorite Toggled': props<{ sessionId: number }>(), // Creator-Name: favoriteToggled
  },
});

// Ereignisse der API: Ergebnis eines Aufrufs
export const sessionsApiActions = createActionGroup({
  source: 'Sessions API',
  events: {
    'Sessions Loaded Success': props<{ sessions: Session[] }>(),
    'Sessions Loaded Failure': props<{ error: string }>(),
  },
});
