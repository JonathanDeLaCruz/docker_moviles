import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { MateriasListPageRoutingModule } from './materias-list-routing.module';

import { MateriasListPage } from './materias-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MateriasListPageRoutingModule
  ],
  declarations: [MateriasListPage]
})
export class MateriasListPageModule {}
