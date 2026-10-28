import { Pipe, PipeTransform } from '@angular/core';

/** 90 -> "1 h 30 min". Standalone: ohne "standalone: false" (Default seit v19). */
@Pipe({ name: 'duration' })
export class DurationPipe implements PipeTransform {
  transform(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (!h) return `${m} min`;
    return m ? `${h} h ${m} min` : `${h} h`;
  }
}
