import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductoImagenPageRoutingModule } from './producto-imagen-routing.module';

import { ProductoImagenPage } from './producto-imagen.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductoImagenPageRoutingModule
  ],
  declarations: [ProductoImagenPage]
})
export class ProductoImagenPageModule {}
