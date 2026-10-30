# Lab 6.1 – Übung: Warenkorb für Workshop-Tickets

**Dauer:** ca. 16 Minuten
**Ändert die EventHub-Projektbasis?** Ja — der Warenkorb ist das erste Feature mit Signals; Lab 7.1 ordnet diesen Zustand ein.

## Vorbereitung

- Terminal 1 im Ordner `project/`: `npm start` (die Mock-API wird in diesem Lab nicht gebraucht; die Workshops stehen im Starter)
- Arbeitsdatei: `src/app/playground/playground.ts`
- Starter: `src/app/starters/m06-l01-signals.ts`
- Browser: http://localhost:4200/playground

Template, Workshop-Daten, die Auswahl (`selectedId`, `selectWorkshop`) und `remove()` sind fertig. Die TODOs betreffen nur die Klasse.

## Aufgaben

1. Kopiere den Starter nach `src/app/playground/playground.ts` und öffne `/playground`. Klicke „In den Warenkorb“ und prüfe Konsole und Anzeige.
2. Implementiere `addToCart()` mit `items.update(...)`: neue Position anhängen oder bei vorhandenem Workshop die Menge erhöhen. Erzeuge immer ein neues Array. `remove()` ist im Starter schon fertig und zeigt das Muster.
3. Ersetze `ticketCount` und `subtotal` durch echte `computed`-Berechnungen aus `items()`.
4. Berechne `discount` (10 % der Zwischensumme ab 3 Tickets, gerundet) und `total` als `computed`. Prüfe mit 2 und mit 3 Tickets.
5. Speichere `items()` per `effect` im Konstruktor unter `STORAGE_KEY` im `localStorage` und lies den Startwert von `items` von dort (bei fehlendem oder ungültigem Eintrag `[]`). Lade die Seite neu und prüfe, dass der Warenkorb erhalten bleibt.
6. Ersetze `quantity` durch ein `linkedSignal`, das bei jedem Wechsel von `selectedId` auf 1 zurückspringt. Prüfe: Menge auf 4 stellen, Workshop wechseln.

## Checkpoint

- Nach Aufgabe 2: Positionen erscheinen, gleiche Workshops erhöhen die Menge, „Entfernen“ funktioniert; Summen stehen noch auf 0.
- Nach Aufgabe 4: 2 Tickets à 290 € ergeben 580 €; 3 Tickets ergeben 870 € − 87 € = 783 €.
- Nach Aufgabe 5: Nach F5 ist der Warenkorb unverändert.

## Abschlusskriterien

- Summe, Rabatt und Ticketzahl ändern sich live bei jeder Aktion, ohne eigene Aktualisierungslogik.
- Kein `effect` setzt ein Signal; abgeleitete Werte sind ausschließlich `computed`.
- Der Warenkorb übersteht ein Neuladen.

## Erweiterung

- Öffne in den DevTools „Application“ → „Local Storage“ → `http://localhost:4200` und vergleiche den Eintrag `eventhub-cart` mit der Anzeige.
- Schreibe testweise die Summe per `effect` in ein eigenes `signal` statt per `computed` und beobachte, wann die Anzeige aktualisiert wird. Notiere, warum `computed` die bessere Wahl ist, und stelle den Code wieder her.
- Füge einen Button „Warenkorb leeren“ hinzu.
