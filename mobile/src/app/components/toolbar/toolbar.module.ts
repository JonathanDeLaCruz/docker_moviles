import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ToolbarComponent } from './toolbar.component';
@NgModule({
  declarations: [ToolbarComponent],
  imports: [CommonModule, IonicModule],
  exports: [ToolbarComponent]
})
export class ToolbarModule {}
