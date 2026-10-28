import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Session, Speaker } from './models';

/** Basis-URL der Mock-API (npm run api). Lab 2.2 zeigt, wie sie aus einer Konfigurationsdatei kommt. */
export const API_URL = 'http://localhost:3000';

export interface SessionQuery {
  q?: string;
  level?: string;
  track?: string;
  type?: string;
}

/** Klassischer HTTP-Service der Beispiele: liefert Observables, kennt keinen Zustand. */
@Injectable({ providedIn: 'root' })
export class SessionApi {
  private readonly http = inject(HttpClient);

  getSessions(query: SessionQuery = {}): Observable<Session[]> {
    const params = Object.fromEntries(Object.entries(query).filter(([, value]) => !!value)) as Record<string, string>;
    return this.http.get<Session[]>(`${API_URL}/sessions`, { params });
  }

  getSession(id: number): Observable<Session> {
    return this.http.get<Session>(`${API_URL}/sessions/${id}`);
  }

  getSpeakers(): Observable<Speaker[]> {
    return this.http.get<Speaker[]>(`${API_URL}/speakers`);
  }
}
