import { PaginacionModule } from '../components/paginacion/paginacion.module';
import { ToolbarModule } from '../components/toolbar/toolbar.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductosListPageRoutingModule } from './productos-list-routing.module';

import { ProductosListPage } from './productos-list.page';

@NgModule({
  imports: [
    PaginacionModule,
    ToolbarModule,
    CommonModule,
    FormsModule,
    IonicModule,
    ProductosListPageRoutingModule
  ],
  declarations: [ProductosListPage]
})
export class ProductosListPageModule {}
