import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { DashboardConfig } from './dashboard-config';

/** Lädt die Konfiguration, bevor die Route aktiviert wird. Ergebnis kommt als input() "config" an. */
export const dashboardConfigResolver: ResolveFn<DashboardConfig> = () =>
  inject(HttpClient).get<DashboardConfig>('/dashboard-widgets.json');
