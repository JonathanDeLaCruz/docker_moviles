import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { PaginacionComponent } from './paginacion.component';

@NgModule({
  declarations: [
    PaginacionComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    PaginacionComponent
  ]
})
export class PaginacionModule {}
