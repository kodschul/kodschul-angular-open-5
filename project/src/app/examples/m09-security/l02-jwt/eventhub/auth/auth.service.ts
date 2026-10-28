import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { API_URL, LoginResponse, User } from '../data';
import { isExpired } from './jwt';

interface AuthState {
  token: string;
  user: User;
}

const STORAGE_KEY = 'eventhub.auth';

/** Hält den Login-Zustand als Signal. Speicherort: sessionStorage (Begründung in Lab 9.1). */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly state = signal<AuthState | null>(readStoredState());

  readonly token = computed(() => this.state()?.token ?? null);
  readonly user = computed(() => this.state()?.user ?? null);
  readonly isLoggedIn = computed(() => this.state() !== null);
  readonly isAdmin = computed(() => this.user()?.role === 'admin');

  /** expiresIn in Sekunden; 10 testet den Token-Ablauf. */
  login(email: string, password: string, expiresIn = 3600): Observable<User> {
    return this.http.post<LoginResponse>(`${API_URL}/auth/login`, { email, password, expiresIn }).pipe(
      tap((res) => this.setState({ token: res.accessToken, user: res.user })),
      map((res) => res.user),
    );
  }

  logout(): void {
    this.setState(null);
  }

  private setState(state: AuthState | null): void {
    this.state.set(state);
    if (state) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }
}

/** Beim Start: gespeicherten Login übernehmen, abgelaufene Tokens verwerfen. */
function readStoredState(): AuthState | null {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  const state = JSON.parse(raw) as AuthState;
  return isExpired(state.token) ? null : state;
}
