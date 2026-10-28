// Transferprojekt: Ereignisse der Warteliste (Muster aus Lab 7.5).
import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';
import { WaitlistEntry, WaitlistRequest } from './waitlist.model';

/** Was auf der Seite passiert. */
export const waitlistPageEvents = eventGroup({
  source: 'Waitlist Page',
  events: {
    joinRequested: type<WaitlistRequest>(),
  },
});

/** Was die API zurückmeldet. */
export const waitlistApiEvents = eventGroup({
  source: 'Waitlist API',
  events: {
    joined: type<WaitlistEntry>(),
    joinFailed: type<string>(),
  },
});
