import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { API_URL, Session } from '../data';

// Admin-Bereich: Session-Editor mit Reactive Forms. Nur wenige Personen nutzen ihn,
// trotzdem landet sein Code (inkl. @angular/forms) ohne Lazy Loading im Start-Bundle.
@Component({
  selector: 'eh-admin-page',
  imports: [ReactiveFormsModule],
  template: `
    <h1>Admin: Sessions bearbeiten</h1>
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
    // Speichern (PATCH /sessions/:id) braucht einen Admin-Login – Thema von Modul 9.
    this.previewText.set(JSON.stringify({ id: this.selectedId(), ...this.form.getRawValue() }, null, 2));
  }
}
