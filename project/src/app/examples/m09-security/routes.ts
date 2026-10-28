import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { Routes } from '@angular/router';
import { authInterceptor } from './l02-jwt/eventhub/auth/auth.interceptor';
import { LOGIN_URL } from './l02-jwt/eventhub/auth/login-url';

// Routen der Beispiele dieses Moduls: path = Lab-Ordnername (z. B. 'l01-…').
export default [
  {
    path: 'l01-tokens',
    title: 'Lab 9.1 Token-basierte Authentifizierung',
    loadComponent: () => import('./l01-tokens/example').then((m) => m.TokensExample),
  },
  {
    // Mini-EventHub mit Login, Interceptor und Guards. Im Workspace stehen diese Provider in app.config.ts.
    path: 'l02-jwt',
    title: 'Lab 9.2 JWT im Angular-Client',
    providers: [
      provideHttpClient(withFetch(), withInterceptors([authInterceptor])), // eigener HttpClient nur für dieses Beispiel
      { provide: LOGIN_URL, useValue: '/examples/m09-security/l02-jwt/login' },
    ],
    loadChildren: () => import('./l02-jwt/eventhub/eventhub.routes'),
  },
  {
    // OIDC braucht provideAuth in der Root-Konfiguration -> lauffähig im Workspace eventhub-lab.
    path: 'l03-oidc',
    title: 'Lab 9.3 OAuth 2.0 und OpenID Connect',
    loadComponent: () => import('./l03-oidc/example').then((m) => m.OidcExampleInfo),
  },
] satisfies Routes;
