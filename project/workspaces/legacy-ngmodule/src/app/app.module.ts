import { HttpClientModule } from '@angular/common/http';
import {
  NgModule,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AboutComponent } from './about.component';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';

// Wurzelmodul im Stil Angular 15: deklariert die Root-Komponente und bündelt globale Module.
@NgModule({
  declarations: [AppComponent, AboutComponent],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule, SharedModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
