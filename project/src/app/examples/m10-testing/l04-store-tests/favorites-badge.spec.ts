import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { FavoritesBadge } from './favorites-badge';
import { initialState, sessionsFeature } from './sessions.feature';

// Komponente mit Store: provideMockStore statt echtem Store, Reducer und Effects.
describe('FavoritesBadge', () => {
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FavoritesBadge],
      providers: [provideMockStore({ initialState: { sessions: initialState } })],
    });
    store = TestBed.inject(MockStore);
  });

  // overrideSelector ändert den (global geteilten) Selector: danach zurücksetzen.
  afterEach(() => store.resetSelectors());

  it('zeigt den überschriebenen Wert des Selectors an', async () => {
    store.overrideSelector(sessionsFeature.selectFavoriteCount, 3);

    const fixture = TestBed.createComponent(FavoritesBadge);
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('★ 3');
  });

  it('folgt einem neu gesetzten State', async () => {
    const fixture = TestBed.createComponent(FavoritesBadge);
    await fixture.whenStable();

    store.setState({ sessions: { ...initialState, favoriteIds: [1, 7] } });
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('★ 2');
  });
});
