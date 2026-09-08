import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { UsuariosListPageRoutingModule } from './usuarios-list-routing.module';

import { UsuariosListPage } from './usuarios-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsuariosListPageRoutingModule
  ],
  declarations: [UsuariosListPage]
})
export class UsuariosListPageModule {}
