import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductosViewPageRoutingModule } from './productos-view-routing.module';

import { ProductosViewPage } from './productos-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductosViewPageRoutingModule
  ],
  declarations: [ProductosViewPage]
})
export class ProductosViewPageModule {}
