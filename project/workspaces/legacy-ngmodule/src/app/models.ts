// Ausschnitt der EventHub-Modelle (Mock-API aus output/project/api).
export interface Speaker {
  id: number;
  name: string;
  company: string;
}

export interface Session {
  id: number;
  title: string;
  abstract: string;
  level: string;
  track: string;
  room: string;
  start: string;
  durationMin: number;
  speaker?: Speaker | null;
}
