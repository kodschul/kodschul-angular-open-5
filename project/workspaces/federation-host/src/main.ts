import { initFederation } from '@angular-architects/native-federation';

// 1. Manifest lesen (welcher Remote liegt wo?), geteilte Pakete per Import Map verteilen.
// 2. Erst danach die Angular-App starten; das Ergebnis (nf) enthält loadRemoteModule.
initFederation('federation.manifest.json', {
  hostRemoteEntry: { url: './remoteEntry.json' },
})
  .then((nf) => import('./bootstrap').then((m) => m.bootstrap(nf)))
  .catch((err) => console.error(err));
