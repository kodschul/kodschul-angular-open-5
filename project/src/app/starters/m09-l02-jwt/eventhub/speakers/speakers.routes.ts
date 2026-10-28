import { Routes } from '@angular/router';
import { SpeakerDetail } from './speaker-detail';
import { SpeakerList } from './speaker-list';

// Routen des Speaker-Features. Wird per loadChildren erst beim ersten Besuch geladen.
export default [
  { path: '', title: 'Speaker', component: SpeakerList },
  { path: ':id', title: 'Speaker', component: SpeakerDetail },
] satisfies Routes;
