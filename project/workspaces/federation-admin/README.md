# federation-admin (Lab 12.2, Remote)

Admin-Bereich als Native-Federation-Remote (Angular 22, `@angular-architects/native-federation` 22.2). Gibt `./routes` (`src/app/admin.routes.ts`) frei; allein gestartet zeigt er dieselben Routen.

Eingerichtet mit:

```bash
npx ng add @angular-architects/native-federation --project federation-admin --port 4201 --type remote
```

## Start

```bash
# Mock-API im Kursprojekt (project/)
npm run api

# in diesem Ordner
npm install
npx ng serve                # http://localhost:4201, remoteEntry.json unter /remoteEntry.json
```

Der Host liegt in `../federation-host/`.
