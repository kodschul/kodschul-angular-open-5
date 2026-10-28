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
