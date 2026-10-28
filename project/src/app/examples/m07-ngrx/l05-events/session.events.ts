// Lab 7.5: Ereignisse des Admin-Bereichs. Diese Datei kennt keinen Store;
// jeder Store, der reagieren will, importiert nur das Ereignis.
import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';

export const sessionAdminEvents = eventGroup({
  source: 'Session Admin',
  events: {
    // Typ: '[Session Admin] cancelled', Payload: welche Session
    cancelled: type<{ sessionId: number; title: string }>(),
  },
});
