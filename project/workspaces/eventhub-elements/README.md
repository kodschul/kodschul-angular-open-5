# eventhub-elements (Lab 11.3)

Angular-22-Projekt, das die Komponente `SignupWidget` als Custom Element `<eventhub-signup>` baut (`@angular/elements`). `public/demo.html` ist eine statische Seite ohne Angular, die das Widget einbindet und das DOM-Event `registered` abfängt.

Erzeugt mit `ng new eventhub-elements --minimal --routing=false` und `npm install @angular/elements`. Im Build gilt `outputHashing: "none"`, damit die Datei `main.js` heißt.

## Start

```bash
npm install
npm run build              # -> dist/eventhub-elements/browser/main.js, demo.html
npm run serve:dist         # http://localhost:4230/demo.html
```

`demo.html` braucht einen Webserver (ES-Module laufen nicht über `file://`).
