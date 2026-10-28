// Lab 7.3: Actions aus Lab 7.2, ergänzt um „Neu laden“ und „Favoriten speichern“.
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Session } from '../../../shared/models';

export const sessionsPageActions = createActionGroup({
  source: 'Sessions Page',
  events: {
    Opened: emptyProps(),
    'Reload Clicked': emptyProps(),
    'Favorite Toggled': props<{ sessionId: number }>(),
    'Save Favorites Clicked': props<{ favoriteIds: number[] }>(),
  },
});

export const sessionsApiActions = createActionGroup({
  source: 'Sessions API',
  events: {
    'Sessions Loaded Success': props<{ sessions: Session[] }>(),
    'Sessions Loaded Failure': props<{ error: string }>(),
    'Favorites Saved Success': props<{ favoriteIds: number[] }>(),
    'Favorites Saved Failure': props<{ error: string }>(),
  },
});
