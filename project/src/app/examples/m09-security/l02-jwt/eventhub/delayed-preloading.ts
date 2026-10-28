import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, switchMap, timer } from 'rxjs';

/**
 * Lädt nur Routen mit data: { preload: true } vor – und erst 2 s nach dem Start,
 * damit der erste Seitenaufbau die Bandbreite für sich hat.
 */
@Injectable({ providedIn: 'root' })
export class DelayedPreloading implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    if (route.data?.['preload'] !== true) {
      return of(null); // nicht vorladen: erst beim ersten Besuch
    }
    console.log(`[Preloading] "${route.path}" startet in 2 s`);
    return timer(2000).pipe(
      switchMap(() => {
        console.log(`[Preloading] lade "${route.path}"`);
        return load(); // ruft loadChildren bzw. loadComponent der Route auf
      }),
    );
  }
}
