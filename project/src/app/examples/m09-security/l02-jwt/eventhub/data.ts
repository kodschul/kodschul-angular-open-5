// Eigenständige Datenbasis des EventHub-Labs: dieselbe Datei liegt im Workspace und in den Beispielen.
export const API_URL = 'http://localhost:3000';

export interface Session {
  id: number;
  title: string;
  track: string;
  level: string;
  room: string;
  start: string;
  capacity: number;
  booked: number;
  speakerId: number;
}

export interface Speaker {
  id: number;
  name: string;
  company: string;
  bio: string;
}

// ---- ab Lab 9.2: Login ----
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

export interface AdminStats {
  sessions: number;
  speakers: number;
  registrations: number;
  utilization: number;
}
