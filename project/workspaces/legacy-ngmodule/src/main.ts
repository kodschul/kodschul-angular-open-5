import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app.module';

// Klassischer Start über ein NgModule (Angular ≤ 16)

platformBrowser()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
