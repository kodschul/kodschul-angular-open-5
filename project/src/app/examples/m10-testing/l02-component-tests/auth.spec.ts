import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import {
  PartialMatchRouteSnapshot,
  Router,
  UrlSegment,
  UrlTree,
  provideRouter,
} from '@angular/router';
import { User } from '../../../shared/models';
import { AuthService, adminGuard, authInterceptor } from './auth';

const admin: User = { sub: '1', email: 'admin@eventhub.test', name: 'Alex Admin', role: 'admin' };
const user: User = { sub: '2', email: 'user@eventhub.test', name: 'Uli User', role: 'user' };

describe('adminGuard', () => {
  const segments = [new UrlSegment('admin', {})];
  // Dritter Parameter von CanMatchFn (Angular 22): Teil-Snapshot der Route; der Guard nutzt ihn nicht.
  const snapshot = {} as PartialMatchRouteSnapshot;

  // Funktionale Guards rufen inject() auf und brauchen deshalb einen Injection Context.
  function runGuard() {
    return TestBed.runInInjectionContext(() => adminGuard({ path: 'admin' }, segments, snapshot));
  }

  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  it('lässt die Rolle admin durch', () => {
    TestBed.inject(AuthService).setSession('token-admin', admin);
    expect(runGuard()).toBe(true);
  });

  it('leitet die Rolle user zum Login mit Rücksprung-URL um', () => {
    TestBed.inject(AuthService).setSession('token-user', user);

    const result = runGuard();

    expect(result).toBeInstanceOf(UrlTree);
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe(
      '/login?returnUrl=%2Fadmin',
    );
  });

  it('leitet ohne Anmeldung ebenfalls zum Login um', () => {
    expect(runGuard()).toBeInstanceOf(UrlTree);
  });
});

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('hängt das Token als Bearer-Header an', () => {
    TestBed.inject(AuthService).setSession('abc.def.ghi', user);

    http.get('/favorites').subscribe();

    const req = httpTesting.expectOne('/favorites');
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc.def.ghi');
    req.flush([]);
  });

  it('schickt ohne Anmeldung keinen Header', () => {
    http.get('/sessions').subscribe();

    const req = httpTesting.expectOne('/sessions');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush([]);
  });
});
