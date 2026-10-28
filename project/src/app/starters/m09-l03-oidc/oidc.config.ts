import { LogLevel, OpenIdConfiguration } from 'angular-auth-oidc-client';

// Starter Lab 9.3: Werte aus workspaces/keycloak/realm/eventhub-realm.json eintragen.
export const oidcConfig: OpenIdConfiguration = {
  authority: '', // TODO 3: Issuer-URL des Realms "eventhub"
  clientId: '', // TODO 3: Client-ID aus dem Realm-Export
  responseType: 'code',
  scope: 'openid', // TODO 3: zusätzlich profile und email anfordern
  redirectUrl: `${window.location.origin}/oidc`,
  postLogoutRedirectUri: `${window.location.origin}/oidc`,
  silentRenew: false,
  logLevel: LogLevel.Warn,
};
