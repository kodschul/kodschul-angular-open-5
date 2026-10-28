import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DurationPipe } from './duration.pipe';
import { LevelBadgeComponent } from './level-badge.component';

// Typisches SharedModule: deklariert gemeinsame Bausteine und exportiert sie samt CommonModule.
@NgModule({
  declarations: [LevelBadgeComponent, DurationPipe],
  imports: [CommonModule],
  exports: [CommonModule, LevelBadgeComponent, DurationPipe],
})
export class SharedModule {}
