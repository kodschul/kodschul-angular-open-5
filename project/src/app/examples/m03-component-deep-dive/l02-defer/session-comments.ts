import { Component, Input } from '@angular/core';

interface SessionComment {
  id: number;
  author: string;
  text: string;
}

// Kommentarbereich mit lokalen Beispieldaten (die Mock-API hat keine Kommentare).
// Eigenständige Komponente, damit @defer sie in einen eigenen Chunk auslagern kann.
@Component({
  selector: 'app-session-comments',
  template: `
    <div class="card">
      <p class="muted">Kommentare zu Session {{ sessionId }}</p>
      @for (comment of comments; track comment.id) {
        <p><strong>{{ comment.author }}:</strong> {{ comment.text }}</p>
      } @empty {
        <p class="muted">Noch keine Kommentare.</p>
      }
      <label for="comment">Neuer Kommentar</label>
      <textarea id="comment" #text rows="2"></textarea>
      <div class="row">
        <button class="btn btn-primary" (click)="add(text.value); text.value = ''">Kommentieren</button>
      </div>
    </div>
  `,
})
export class SessionComments {
  @Input() sessionId = 0;

  comments: SessionComment[] = [
    { id: 1, author: 'Alex', text: 'Gibt es die Folien danach zum Download?' },
    { id: 2, author: 'Sam', text: 'Passt gut zum Workshop am zweiten Tag.' },
  ];

  add(text: string): void {
    if (!text.trim()) return;
    // neues Array statt push: eindeutige Änderung für die Ansicht
    this.comments = [...this.comments, { id: Date.now(), author: 'Gast', text: text.trim() }];
  }
}
