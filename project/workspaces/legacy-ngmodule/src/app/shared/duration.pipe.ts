import { Pipe, PipeTransform } from '@angular/core';

// 90 -> "1 h 30 min"
@Pipe({ name: 'duration', standalone: false })
export class DurationPipe implements PipeTransform {
  transform(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h ? `${h} h${m ? ` ${m} min` : ''}` : `${m} min`;
  }
}
