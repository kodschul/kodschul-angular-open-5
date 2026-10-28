import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { User } from '../../shared/models';

// Starter Lab 10.2 (c, Erweiterung): Guard aus Lab 9.2 testen.
const admin: User = { sub: '1', email: 'admin@eventhub.test', name: 'Alex Admin', role: 'admin' };
const user: User = { sub: '2', email: 'user@eventhub.test', name: 'Uli User', role: 'user' };

describe('adminGuard', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  it.todo('lässt die Rolle admin durch');
  it.todo('leitet die Rolle user zum Login mit Rücksprung-URL um');
});
