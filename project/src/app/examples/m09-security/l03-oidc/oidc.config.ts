import { LogLevel, OpenIdConfiguration } from 'angular-auth-oidc-client';

// OIDC-Konfiguration für den Keycloak-Realm "eventhub" (workspaces/keycloak/).
export const oidcConfig: OpenIdConfiguration = {
  authority: 'http://localhost:8080/realms/eventhub', // Issuer; die Bibliothek liest /.well-known/openid-configuration
  clientId: 'eventhub-spa', // öffentlicher Client, kein Secret
  responseType: 'code', // Authorization Code Flow, PKCE automatisch
  scope: 'openid profile email', // openid = OIDC, profile/email = Claims name, email ...
  redirectUrl: `${window.location.origin}/oidc`, // Rücksprung nach dem Login
  postLogoutRedirectUri: `${window.location.origin}/oidc`,
  silentRenew: false, // Token-Erneuerung bleibt in der Übung aus
  logLevel: LogLevel.Warn,
};
