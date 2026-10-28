import { Routes } from '@angular/router';
import { InfoStep } from './workspace-info';

// Modul 13 läuft in eigenen Workspaces (project/workspaces/…). Die Routen zeigen Info-Seiten,
// damit die Links der Startseite funktionieren und auf Code und Befehle verweisen.
const info = () => import('./workspace-info').then((m) => m.WorkspaceInfo);

export default [
  {
    path: 'l01-measure',
    title: 'Lab 13.1 Performance messen',
    loadComponent: info,
    data: {
      lab: '13.1',
      heading: 'Performance messen mit Lighthouse und DevTools',
      summary: 'Langsame EventHub-Variante im Produktions-Build messen: Lighthouse, Profiler, Bundle-Analyse.',
      paths: ['workspaces/eventhub-perf/'],
      handout: 'm13-performance-docker/l01-measure/',
      steps: [
        { label: 'Mock-API im Kurs-Projekt starten', command: 'npm run api' },
        { label: 'Abhängigkeiten installieren', command: 'cd workspaces/eventhub-perf\nnpm install' },
        { label: 'Produktions-Build mit Statistikdatei erzeugen', command: 'npm run build:stats' },
        { label: 'Build ausliefern und in Chrome mit Lighthouse messen', command: 'npm run serve:dist   # http://localhost:8081' },
        { label: 'Für den Angular-DevTools-Profiler den Entwicklungsserver starten', command: 'npm start   # http://localhost:4300' },
      ] satisfies InfoStep[],
    },
  },
  {
    path: 'l02-optimize',
    title: 'Lab 13.2 Optimieren und nachmessen',
    loadComponent: info,
    data: {
      lab: '13.2',
      heading: 'Optimieren und nachmessen',
      summary: 'Drei Befunde beheben (Bild, @defer, Template-Berechnung), Budgets setzen, erneut messen.',
      paths: ['workspaces/eventhub-perf/ (Arbeitsstand)', 'workspaces/eventhub-perf-fixed/ (Lösung)'],
      handout: 'm13-performance-docker/l02-optimize/',
      steps: [
        { label: 'Lösung bauen und ausliefern', command: 'cd workspaces/eventhub-perf-fixed\nnpm install\nnpm run build\nnpm run serve:dist   # http://localhost:8082' },
        { label: 'Unterschiede zur langsamen Variante ansehen', command: 'git diff --no-index workspaces/eventhub-perf/src workspaces/eventhub-perf-fixed/src' },
      ] satisfies InfoStep[],
    },
  },
  {
    path: 'l03-docker',
    title: 'Lab 13.3 Containerisierung mit Docker',
    loadComponent: info,
    data: {
      lab: '13.3',
      heading: 'Containerisierung mit Docker',
      summary: 'Multi-Stage-Image (Node-Build → nginx) mit SPA-Fallback, Caching-Headern und config.json zur Laufzeit.',
      paths: ['workspaces/docker/ (Lösung)', 'workspaces/docker/starter/ (Starter)'],
      handout: 'm13-performance-docker/l03-docker/',
      steps: [
        { label: 'Image aus dem Ordner workspaces/ bauen', command: 'cd workspaces\ndocker build -f docker/Dockerfile -t eventhub-web .' },
        { label: 'Container starten', command: 'docker run --rm -p 8080:8080 -e API_URL=http://localhost:3000 eventhub-web' },
        { label: 'Deep-Link prüfen', command: 'curl -i http://localhost:8080/sessions/3' },
      ] satisfies InfoStep[],
    },
  },
] satisfies Routes;
