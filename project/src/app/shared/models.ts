// Gemeinsame Datenmodelle der EventHub-Mock-API (api/db.json).
export type SessionLevel = 'Einsteiger' | 'Fortgeschritten' | 'Experte';
export type SessionTrack = 'Frontend' | 'Architektur' | 'Testing' | 'Security';
export type SessionType = 'talk' | 'workshop';

export interface Speaker {
  id: number;
  name: string;
  company: string;
  bio: string;
}

export interface Session {
  id: number;
  title: string;
  abstract: string;
  type: SessionType;
  level: SessionLevel;
  track: SessionTrack;
  speakerId: number;
  /** Von der API mitgeliefert (GET /sessions, GET /sessions/:id). */
  speaker?: Speaker | null;
  room: string;
  /** ISO-Datum ohne Zeitzone, z. B. "2027-03-10T09:30:00". */
  start: string;
  durationMin: number;
  capacity: number;
  booked: number;
  /** Preis in Euro; 0 bei Talks. */
  price: number;
  tags: string[];
}

export interface Registration {
  id?: number;
  name: string;
  email: string;
  company?: string;
  tickets: number;
  workshopIds: number[];
  createdAt?: string;
}

export type UserRole = 'admin' | 'user';

export interface User {
  sub: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}
