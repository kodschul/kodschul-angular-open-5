import { HttpClient, httpResource } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { API_URL, AdminStats, Session } from '../data';

// Admin-Bereich: nur mit Rolle admin erreichbar (adminMatchGuard). Statistik kommt von GET /admin/stats.
@Component({
  selector: 'eh-admin-page',
  imports: [ReactiveFormsModule],
  template: `
    <h1>Admin</h1>
    @if (stats.hasValue()) {
      <p class="card">
        {{ stats.value().sessions }} Sessions · {{ stats.value().speakers }} Speaker ·
        {{ stats.value().registrations }} Anmeldungen · Auslastung {{ stats.value().utilization }} %
      </p>
    } @else if (stats.error()) {
      <p class="error">Statistik nicht verfügbar.</p>
    }
    <div class="row">
      @for (s of sessions(); track s.id) {
        <button class="btn" type="button" (click)="edit(s)">{{ s.id }}</button>
      }
    </div>
    @if (selectedId(); as id) {
      <form class="card" [formGroup]="form" (ngSubmit)="preview()">
        <h3>Session {{ id }}</h3>
        <label for="title">Titel</label>
        <input id="title" formControlName="title" />
        @if (form.controls.title.invalid) {
          <p class="error">Titel mit mindestens 5 Zeichen angeben.</p>
        }
        <label for="room">Raum</label>
        <input id="room" formControlName="room" />
        <p class="row">
          <button class="btn btn-primary" type="submit" [disabled]="form.invalid">Vorschau</button>
        </p>
      </form>
      @if (previewText(); as text) {
        <pre class="card">{{ text }}</pre>
      }
    }
  `,
})
export class AdminPage {
  protected readonly stats = httpResource<AdminStats>(() => `${API_URL}/admin/stats`);
  protected readonly sessions = toSignal(inject(HttpClient).get<Session[]>(`${API_URL}/sessions`), {
    initialValue: [],
  });
  protected readonly selectedId = signal<number | null>(null);
  protected readonly previewText = signal('');
  protected readonly form = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(5)] }),
    room: new FormControl('', { nonNullable: true }),
  });

  edit(session: Session): void {
    this.selectedId.set(session.id);
    this.previewText.set('');
    this.form.setValue({ title: session.title, room: session.room });
  }

  preview(): void {
    this.previewText.set(JSON.stringify({ id: this.selectedId(), ...this.form.getRawValue() }, null, 2));
  }
}
