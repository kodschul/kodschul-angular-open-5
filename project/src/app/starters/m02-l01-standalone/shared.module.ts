import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DurationPipe } from './duration.pipe';
import { LevelBadge } from './level-badge';
import { SpeakerChip } from './speaker-chip';

// Klassisches SharedModule: deklariert gemeinsame Bausteine und exportiert sie samt CommonModule.
@NgModule({
  declarations: [LevelBadge, DurationPipe, SpeakerChip],
  imports: [CommonModule],
  exports: [CommonModule, LevelBadge, DurationPipe, SpeakerChip],
})
export class SharedModule {}
