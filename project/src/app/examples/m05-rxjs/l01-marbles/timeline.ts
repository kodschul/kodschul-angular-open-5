import { MonoTypeOperatorFunction, Observable, tap } from 'rxjs';

/** Ein Zeichen im Diagramm entspricht 100 ms. */
export const FRAME_MS = 100;

/**
 * Erzeugt ein Observable aus einem Marble-Diagramm.
 * '-' = 100 ms ohne Wert, Buchstabe/Ziffer = Wert, '|' = complete, '#' = error.
 * Beispiel: zeitstrahl('-a-b|') sendet 'a' nach 100 ms, 'b' nach 300 ms, complete nach 400 ms.
 */
export function zeitstrahl<T = string>(diagramm: string, werte: Record<string, T> = {}): Observable<T> {
  return new Observable<T>((subscriber) => {
    const timer = [...diagramm.replaceAll(' ', '')].map((zeichen, frame) =>
      setTimeout(() => {
        if (zeichen === '-') return;
        if (zeichen === '|') subscriber.complete();
        else if (zeichen === '#') subscriber.error(new Error('Fehler im Strom'));
        else subscriber.next(zeichen in werte ? werte[zeichen] : (zeichen as T));
      }, frame * FRAME_MS),
    );
    // Aufräumen beim Abbestellen: offene Timer stoppen
    return () => timer.forEach(clearTimeout);
  });
}

/** Loggt jeden Wert mit Frame-Nummer (Zeit seit subscribe / 100 ms). */
export function protokoll<T>(name: string): MonoTypeOperatorFunction<T> {
  let start = 0;
  const frame = () => Math.round((performance.now() - start) / FRAME_MS);
  return tap({
    subscribe: () => (start = performance.now()),
    next: (wert) => console.log(`[${name}] Frame ${frame()}: ${JSON.stringify(wert)}`),
    error: (fehler) => console.log(`[${name}] Frame ${frame()}: # ${fehler.message}`),
    complete: () => console.log(`[${name}] Frame ${frame()}: |`),
  });
}
