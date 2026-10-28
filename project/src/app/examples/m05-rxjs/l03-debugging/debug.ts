import { MonoTypeOperatorFunction, tap } from 'rxjs';

/** Anzahl aktiver Abos je Name, global für die ganze App. */
const aktiveAbos = new Map<string, number>();

/** Benanntes Debug-Logging: zeigt subscribe, Werte, Ende und die Zahl aktiver Abos. */
export function debug<T>(name: string): MonoTypeOperatorFunction<T> {
  const zaehlen = (delta: number) => {
    const anzahl = (aktiveAbos.get(name) ?? 0) + delta;
    aktiveAbos.set(name, anzahl);
    return anzahl;
  };
  return tap({
    subscribe: () => console.log(`[${name}] subscribe – aktiv: ${zaehlen(+1)}`),
    next: (wert) => console.log(`[${name}] next:`, wert),
    error: (fehler) => console.log(`[${name}] error:`, fehler),
    complete: () => console.log(`[${name}] complete`),
    finalize: () => console.log(`[${name}] beendet – aktiv: ${zaehlen(-1)}`),
  });
}
