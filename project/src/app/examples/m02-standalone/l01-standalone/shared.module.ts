import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SpeakerChip } from './speaker-chip';

// SharedModule nach der Übung: zwei Einträge weniger, SpeakerChip bleibt (Mischbetrieb).
@NgModule({
  declarations: [SpeakerChip],
  imports: [CommonModule],
  exports: [CommonModule, SpeakerChip],
})
export class SharedModule {}
