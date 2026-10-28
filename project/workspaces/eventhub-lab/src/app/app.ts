import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Wurzelkomponente des Labs: zeigt nur die Routen. Die Navigation steckt in eventhub/shell.ts.
@Component({
  selector: 'eh-root',
  imports: [RouterOutlet],
  template: `<main class="container"><router-outlet /></main>`,
})
export class App {}
