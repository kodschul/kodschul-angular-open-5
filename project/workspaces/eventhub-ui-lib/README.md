# eventhub-ui-lib (Lab 11.2)

Angular-Workspace ohne App mit der Library `eventhub-ui` (Angular 22, ng-packagr). Enthält `SessionBadge` (aus Lab 3.3) und `TicketCounter` (aus Lab 4.3).

Erzeugt mit:

```bash
npx @angular/cli@22 new eventhub-ui-lib --no-create-application --skip-git
npx ng generate library eventhub-ui --prefix=eh
```

`ng new` funktioniert nicht innerhalb eines anderen Angular-Workspace (z. B. unter `project/`); neue Workspaces daher außerhalb anlegen.

## Start

```bash
npm install
npx ng build eventhub-ui                 # -> dist/eventhub-ui
npx ng test eventhub-ui --watch=false
cd dist/eventhub-ui && npm pack          # -> eventhub-ui-0.1.0.tgz
```

Installation in der zweiten App: siehe `../eventhub-ui-consumer/README.md`.
