# federation-host (Lab 12.2, Host)

EventHub-Host als Native-Federation-Host mit Manifest (`public/federation.manifest.json`). Lädt unter `/admin` die Routen des Remotes `federation-admin` per `loadRemoteModule`.

Eingerichtet mit:

```bash
npx ng add @angular-architects/native-federation --project federation-host --port 4200 --type dynamic-host
```

## Start

Zuerst den Remote starten (`../federation-admin`, Port 4201), die Kurs-App auf Port 4200 beenden, dann:

```bash
npm install
npx ng serve                # http://localhost:4200, Admin unter /admin
```

Port 4200 belegt: `npx ng serve --port 4300`.
