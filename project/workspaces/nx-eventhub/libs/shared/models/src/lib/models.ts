// Datenmodelle der EventHub-Mock-API (Auszug aus dem Kursprojekt, src/app/shared/models.ts).
export type SessionLevel = 'Einsteiger' | 'Fortgeschritten' | 'Experte';

export interface Speaker {
  id: number;
  name: string;
  company: string;
}

export interface Session {
  id: number;
  title: string;
  level: SessionLevel;
  track: string;
  room: string;
  /** ISO-Datum ohne Zeitzone, z. B. "2027-03-10T09:30:00". */
  start: string;
  capacity: number;
  booked: number;
  speaker?: Speaker | null;
}
