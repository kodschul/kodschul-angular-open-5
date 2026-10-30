import { Component } from '@angular/core';

// Lab 9.3 läuft nicht in der Kurs-App: provideAuth braucht die Root-Konfiguration (app.config.ts),
// und die gehört in der Kurs-App allen Beispielen gemeinsam. Diese Seite zeigt, wo das Beispiel liegt.
@Component({
  selector: 'app-oidc-example-info',
  template: `
    <h1>Lab 9.3: OAuth 2.0 und OpenID Connect</h1>
    <section class="card">
      <p>Das lauffähige Beispiel startet im Workspace <code>workspaces/eventhub-lab</code> (Port 4201).</p>
      <ol>
        <li>Keycloak bereitstellen: lokal <code>cd workspaces/keycloak</code>, dann <code>docker compose up</code>; bei einer bereitgestellten Instanz deren Adresse in <code>oidc.config.ts</code> (<code>authority</code>) eintragen</li>
        <li>Beispielstand kopieren: <code>src/app/examples/m09-security/l03-oidc/eventhub/</code> und <code>app.config.ts</code>, <code>oidc.config.ts</code> nach <code>workspaces/eventhub-lab/src/app/</code></li>
        <li>Lab-App starten: <code>cd workspaces/eventhub-lab</code>, dann <code>npx ng serve</code></li>
        <li><code>http://localhost:4201/oidc</code> öffnen, mit <code>alice</code> / <code>alice123</code> oder <code>bob</code> / <code>bob123</code> anmelden</li>
      </ol>
    </section>
    <p class="muted">Grund: Die Dienste von angular-auth-oidc-client sind <code>providedIn: 'root'</code> und finden ihre Konfiguration nur im Root-Injector.</p>
  `,
})
export class OidcExampleInfo {}
