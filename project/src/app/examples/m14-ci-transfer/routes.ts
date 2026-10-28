import { Routes } from '@angular/router';
import { InfoStep } from '../m13-performance-docker/workspace-info';
import { sessionFullGuard } from './transfer/session-full.guard';
import { WaitlistStore } from './transfer/waitlist.store';

// Modul 14 arbeitet mit Workflow-Dateien und Markdown, nicht in der Kurs-App. Info-Seiten statt Beispielen.
const info = () => import('../m13-performance-docker/workspace-info').then((m) => m.WorkspaceInfo);

export default [
  {
    path: 'l01-ci',
    title: 'Lab 14.1 CI-Pipeline für Angular',
    loadComponent: info,
    data: {
      lab: '14.1',
      heading: 'CI-Pipeline für Angular',
      summary: 'GitHub-Actions-Workflow mit Install, Lint, Vitest, Cypress, Build mit Budgets und Docker-Image.',
      paths: ['workspaces/ci/.github/workflows/ci.yml (Lösung)', 'workspaces/ci/starter/ci.yml (Starter)'],
      handout: 'm14-ci-transfer/l01-ci/',
      steps: [
        { label: 'Starter in den Wurzelordner des eigenen Repos kopieren', command: 'mkdir -p .github/workflows\ncp project/workspaces/ci/starter/ci.yml .github/workflows/ci.yml' },
        { label: 'Lokal ausführen (optional, braucht Docker und act)', command: 'act push -W .github/workflows/ci.yml -j test' },
      ] satisfies InfoStep[],
    },
  },
  {
    path: 'l02-architecture-review',
    title: 'Lab 14.2 Architektur-Review',
    loadComponent: info,
    data: {
      lab: '14.2',
      heading: 'Architektur-Review: Bestands-App modernisieren',
      summary: 'Modernisierungsplan mit fünf Maßnahmen für eine Angular-14-App oder das eigene Projekt.',
      paths: ['m14-ci-transfer/anhang-modernisierungsplan-vorlage.md'],
      handout: 'm14-ci-transfer/l02-architecture-review/',
      steps: [{ label: 'Vorlage kopieren und ausfüllen', command: 'cp m14-ci-transfer/anhang-modernisierungsplan-vorlage.md modernisierungsplan.md' }] satisfies InfoStep[],
    },
  },
  {
    path: 'transfer',
    title: 'Transferprojekt EventHub Release',
    loadComponent: info,
    data: {
      lab: '14 (5-Tage-Variante)',
      heading: 'Transferprojekt „EventHub Release“',
      summary: 'Feature „Warteliste“ von der Story bis zum Container, im Team.',
      paths: ['m14-ci-transfer/m14-exc.md', 'm14-ci-transfer/m14-sol.md', 'src/app/examples/m14-ci-transfer/transfer/ (Referenz-Kern)'],
      handout: 'm14-ci-transfer/',
      steps: [
        { label: 'Referenz-Kern öffnen: Warteliste der ausgebuchten Session 6', command: '/examples/m14-ci-transfer/transfer/waitlist/6' },
        { label: 'Tests des Referenz-Kerns', command: 'npx ng test --watch=false --include "src/app/examples/m14-ci-transfer/**/*.spec.ts"' },
      ] satisfies InfoStep[],
    },
  },
  {
    // Referenz-Kern des Transferprojekts: Lazy Route mit Guard, Store nur für diese Route
    path: 'transfer/waitlist/:sessionId',
    title: 'Transferprojekt: Warteliste',
    canActivate: [sessionFullGuard],
    providers: [WaitlistStore],
    loadComponent: () => import('./transfer/waitlist-page').then((m) => m.WaitlistPage),
  },
] satisfies Routes;
