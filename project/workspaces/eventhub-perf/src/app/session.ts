// Ausschnitt aus den EventHub-Modellen (siehe project/src/app/shared/models.ts).
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
  type: 'talk' | 'workshop';
  level: string;
  track: string;
  speaker?: Speaker | null;
  room: string;
  start: string;
  durationMin: number;
  capacity: number;
  booked: number;
  tags: string[];
}
