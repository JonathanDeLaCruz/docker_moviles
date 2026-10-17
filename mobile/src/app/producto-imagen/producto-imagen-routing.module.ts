import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductoImagenPage } from './producto-imagen.page';

const routes: Routes = [
  {
    path: '',
    component: ProductoImagenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductoImagenPageRoutingModule {}
