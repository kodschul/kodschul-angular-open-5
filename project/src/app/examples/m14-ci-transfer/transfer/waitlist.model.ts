import { Registration } from '../../../shared/models';

/** Wartelisten-Eintrag: eine Anmeldung ohne Tickets, markiert mit der vollen Session. */
export interface WaitlistEntry extends Registration {
  waitlistSessionId: number;
}

/** Eingabe aus dem Formular. */
export interface WaitlistRequest {
  sessionId: number;
  name: string;
  email: string;
}
