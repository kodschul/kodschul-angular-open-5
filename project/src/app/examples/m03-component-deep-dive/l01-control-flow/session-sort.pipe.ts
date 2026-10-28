import { Pipe, PipeTransform } from '@angular/core';
import { Session } from '../../../shared/models';

// Reine Pipe: filtert nach Suchbegriff und sortiert nach Titel.
// Sie rechnet nur neu, wenn sich die Liste oder ein Argument ändert.
@Pipe({ name: 'sessionSort' })
export class SessionSortPipe implements PipeTransform {
  transform(sessions: Session[], term: string, descending: boolean): Session[] {
    const needle = term.trim().toLowerCase();
    const result = sessions.filter((s) => s.title.toLowerCase().includes(needle));
    result.sort((a, b) => a.title.localeCompare(b.title, 'de'));
    return descending ? result.reverse() : result;
  }
}
